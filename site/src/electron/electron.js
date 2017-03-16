const electron = require("electron");
const path = require("path");
const url = require("url");
const LOAD_PATH = url.format({
    pathname: path.resolve("../index.html"),
    protocol: "file:",
    slashes: true
});
console.log("loading file " + LOAD_PATH);
let bw = null; // The browser window to run the app in
let init = () => {
    bw = new electron.BrowserWindow;
    bw.loadURL(LOAD_PATH);
    bw.on('closed', () => bw = null);
}
electron.app.on('ready', init);