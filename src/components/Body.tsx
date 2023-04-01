import { useEffect, useRef, useState } from "react";
import addIcon from "../assets/add.svg";
import removeIcon from "../assets/remove.svg";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import OBR, { isImage, Item, Image } from "@owlbear-rodeo/sdk";
import { Header } from "./Header";
import Save from '@mui/icons-material/Save';
import { isPlainObject, getPluginId } from "../obr";
import { CharacterSheet } from "../types";
import { AvatarGroup, FormGroup, IconButton, TextField, Tooltip } from "@mui/material";
import { StyledSwitch } from './Switch'
import AddLinkIcon from '@mui/icons-material/AddLink';

/** Check that the item metadata is in the correct format */
function isMetadata(
  metadata: unknown
): metadata is { url: string; image: string; name: string; gmOnly: boolean; } {
  return (
    isPlainObject(metadata) &&
    typeof metadata.url === "string" &&
    typeof metadata.image === "string" &&
    typeof metadata.name === "string" &&
    typeof metadata.gmOnly === "boolean"
  );
}

export function Body() {
  const [playerRole, setPlayerRole] = useState('');
  const [currentTab, setCurrentTab] = useState(0);

  useEffect(() => {
    OBR.contextMenu.create({
      icons: [
        {
          icon: addIcon,
          label: "Add Character",
          filter: {
            every: [
              { key: "type", value: "IMAGE" },
              { key: "layer", value: "CHARACTER" },
              { key: ["metadata", getPluginId("metadata")], value: undefined },
            ],
            permissions: ["UPDATE"],
          },
        },
        {
          icon: removeIcon,
          label: "Remove Character",
          filter: {
            every: [
              { key: "type", value: "IMAGE" },
              { key: "layer", value: "CHARACTER" },
            ],
            permissions: ["UPDATE"],
          },
        },
      ],
      id: getPluginId("menu/toggle"),
      onClick(context) {
        OBR.scene.items.updateItems(context.items as Image[], (items) => {
          // Check whether to add the items to initiative or remove them
          const add = items.every(
            (item) => item.metadata[getPluginId("metadata")] === undefined
          );

          let count = 0;
          for (let item of items) {
            if (add) {
              item.metadata[getPluginId("metadata")] = {
                url: "",
                image: item.image.url,
                name: item.text.plainText || item.name,
                gmOnly: playerRole === "GM"
              };
              count += 1;
            } else {
              delete item.metadata[getPluginId("metadata")];
            }
          }
        });
      },
    });
  }, []);

  const [characterSheets, setCharacterSheets] = useState<CharacterSheet[]>([]);
  useEffect(() => {
    const handleItemsChange = (items: Item[]) => {
      const characterSheets: CharacterSheet[] = [];
      for (const item of items) {
        if (isImage(item)) {
          const metadata = item.metadata[getPluginId("metadata")];
          if (isMetadata(metadata)) {
            characterSheets.push({
              id: item.id,
              url: metadata.url,
              image: metadata.image,
              name: metadata.name,
              gmOnly: metadata.gmOnly || false
            });
          }
        }
      }
      setCharacterSheets(characterSheets);
    };

    OBR.scene.items.getItems().then(handleItemsChange);
    return OBR.scene.items.onChange(handleItemsChange);
  }, []);

  const handleSubmit = (e: any) => {
    e.preventDefault()

    const formData = new FormData(e.target);
    const data: any = {}
    for (var [key, value] of formData.entries()) {
      data[key] = value;
    }
    data.gmOnly = data.gmOnly === "on" || false

    setCharacterSheets((prev) =>
      prev.map((character) => {
        if (character.id === data.id) {
          return {
            ...character,
            ...data,
          };
        } else {
          return character;
        }
      })
    );
    // Sync changes over the network
    OBR.scene.items.updateItems([data.id], (items) => {
      for (let item of items) {
        const metadata = item.metadata[getPluginId("metadata")];
        if (isMetadata(metadata)) {
          metadata.url = data.url;
          metadata.gmOnly = data.gmOnly;
        }
      }
    });
  }

  const headers = characterSheets.map((c, i) => {
    if (!c.gmOnly || playerRole === "GM") {
      return (
        <Avatar
          sx={{ boxShadow: i === currentTab ? "0px 0px 0px 1px white;" : '' }}
          onClick={(e) => setCurrentTab(i)}
          alt={c.name}
          src={c.image}
        >
        </Avatar>
      )
    }
  })

  const content = characterSheets.map((c, i) => {
    if (!c.gmOnly || playerRole === "GM") {

      return (
        <Box sx={{ overflow: "hidden", borderRadius: '10px', margin: '8px', display: i === currentTab ? 'block' : 'none' }}>
          {c.url ?
            c.url.includes('5esrd') ?
              <iframe sandbox="allow-scripts" src={c.url} height="800" width="450px" style={{ border: '0' }}></iframe>
              : 
              <iframe src={c.url} height="800" width="450px" style={{ border: '0' }}></iframe>
            :
            <form onSubmit={handleSubmit}>
              <FormGroup aria-label="position" row sx={{ padding: '10px' }}>
                <TextField name="url" placeholder="External Page URL" variant="standard" sx={{ width: '70%', marginRight: 2 }}></TextField>
                <Tooltip title="GM Only">
                  <StyledSwitch name="gmOnly"></StyledSwitch>
                </Tooltip>
                <input type="hidden" value={c.id} name="id"></input>
                <Tooltip title="Save">
                  <IconButton type="submit"><Save></Save></IconButton>
                </Tooltip>
              </FormGroup>
            </form>
          }
        </Box>
      )
    }
  })

  useEffect(() => {
    OBR.player.getRole().then(setPlayerRole);
  }, []);

  useEffect(() => {
    OBR.action.setHeight(890);
    OBR.action.setWidth(470);
  }, []);

  return (
    <Stack height="100vh">
      <Header
        action={
          <AvatarGroup max={20} spacing="small">
            {headers}
          </AvatarGroup>
        }
      />
      {content}
    </Stack >
  );
}
