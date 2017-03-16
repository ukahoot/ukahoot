## Building
This directory contains all the code required to make the client run.
Building requires the following programs:
- GNU make
- [Babel Compiler](http://babeljs.io/)
- [Babel env Preset](https://github.com/babel/babel-preset-env)
- [Babeli](https://github.com/babel/babili)

After those are installed, you can build by executing `make` in a terminal window

## Developer mode
ukahoot has a "developer mode" which loads the source files instead of the build file.<br>
To enable developer mode, set "ukahootDevMode" in localStorage to any value.<br>
To disable it, delete the "ukahootDevMode" value.<br>