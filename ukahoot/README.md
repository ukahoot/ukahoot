## Building
This directory contains all the code required to make the client run.
Building the ukahoot client requires the following programs:
- GNU make
- [Node.js 7+](https://nodejs.org/en/)
- [Babel Compiler](http://babeljs.io/)
- [Babel env Preset](https://github.com/babel/babel-preset-env)
- [Babeli](https://github.com/babel/babili)

After those are installed, you can build by executing `make client` in a terminal window.

### Building ukahoot desktop apps
To build the desktop apps for Windows and Linux make sure you [install the necessary cross-platform build libraries for your OS](https://github.com/electron-userland/electron-builder/wiki/Multi-Platform-Build), then execute the following in a terminal window:
```sh
npm i # Installs tools for building
make electron # Builds binaries
```
This will export the following to the dist/ directory:
- rpm amd64 package
- deb amd64 package
- Linux amd64 tarball
- ZIP archive of Windows build
- NSIS Windows installer
- Directories containing both Windows and Linux binaries

## Developer mode
ukahoot has a "developer mode" which loads the source files instead of the build file.<br>
To enable developer mode, set "ukahootDevMode" in localStorage to any value.<br>
To disable it, delete the "ukahootDevMode" value.<br>

## Electron
ukahoot can be run as a desktop app using electron.<br>
To run ukahoot as an electron app, make sure you have installed [Electron](https://electron.atom.io/) and run `npm start` in a terminal window.