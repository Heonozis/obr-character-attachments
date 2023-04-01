# Owlbear Rodeo Kenku FM Remote Control

A basic remote control app for Keku FM to let you switch between playlists with no need to switch windows.

## Prerequisites

For this plugin to work you need to build updated version of Kenku FM from this [repository](https://github.com/Heonozis/kenku-fm/tree/cors-enabled) `cors-enabled` branch.

This patch allow browser to connect to Kenku FM remote control server, read more about CORS [here](https://medium.com/@baphemot/understanding-cors-18ad6b478e2b).

Until Owlbears patch this or find another way to interact with the program the only way to use kenku with pluginds is rebuild it.

## Installing

The extension can be installed from the [store page](https://extensions.owlbear.rodeo/kenku-remote-control).

## How it Works

This project is a simple [React](https://reactjs.org/) app.

It communicates with Kenku FM viat HTTP API described [here](https://www.kenku.fm/docs/using-kenku-remote).

Features:
- pulls your playlists
- play
- pause
- mute
- shuffle

## Building

This project uses [Yarn](https://yarnpkg.com/) as a package manager.

To install all the dependencies run:

`yarn`

To run in a development mode run:

`yarn dev`

To make a production build run:

`yarn build`

To deploy it to Github Pages

`yarn build && yarn deploy`

## License

GNU GPLv3

Copyright (C) 2023 Platon Mysnyk

