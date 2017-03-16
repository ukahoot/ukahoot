const electron = require("electron");
const path = require("path");
const url = require("url");
const process = require('process');
const os = require("os");

process.chdir(".."); // Go back one directory
const LOAD_PATH = url.format({
    pathname: path.resolve("ukahoot/src/electron/app.html"),
    protocol: "file:",
    slashes: true
});
var WINDOW_OPTS = {
    resizable: true,
    darkTheme: true,
    javascript: true,
    center: true,
    minWidth: 800,
    minHeight: 600,
    width: 1280,
    height: 960,
    title: "ukahoot",
    icon: path.resolve("assets/icon.png")
}
if (os.platform() === "win32") // Use ICO file on windows
    WINDOW_OPTS.icon = path.resolve("assets/icon.ico");
console.log("loading file " + LOAD_PATH);
let bw = null; // The browser window to run the app in
let init = () => {
    bw = new electron.BrowserWindow(WINDOW_OPTS);
    bw.loadURL(LOAD_PATH);
    bw.on('closed', () => bw = null);
}
electron.app.on('ready', init);