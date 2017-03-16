const electron = require("electron");
const path = require("path");
const url = require("url");
const process = require('process');

process.chdir(".."); // Go back one directory
const LOAD_PATH = url.format({
    pathname: path.resolve("site/src/electron/app.html"),
    protocol: "file:",
    slashes: true
});
console.log("loading file " + LOAD_PATH);
let bw = null; // The browser window to run the app in
let init = () => {
    bw = new electron.BrowserWindow;
    bw.loadURL(LOAD_PATH);
    bw.webContents.openDevTools();
    bw.on('closed', () => bw = null);
}
electron.app.on('ready', init);