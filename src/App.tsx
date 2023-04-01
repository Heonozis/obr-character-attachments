import { useEffect, useState } from "react";

import OBR from "@owlbear-rodeo/sdk";
import { Header } from "./components/Header";
import { Body } from "./components/Body";

export function App() {
  const [sceneReady, setSceneReady] = useState(false);
  useEffect(() => {
    OBR.scene.isReady().then(setSceneReady);
    return OBR.scene.onReadyChange(setSceneReady);
  }, []);

  if (sceneReady) {
    return <Body />;
  } else {
    // Show a basic header when the scene isn't ready
    return (
      <Header subtitle="Open a scene to use the initiative tracker" />
    );
  }
}
