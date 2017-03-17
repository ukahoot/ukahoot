const electron = require("electron");
const url = require("url");
const os = require("os");

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
    icon: "icon.png"
}
if (os.platform() === "win32") // Use ICO file on windows
    WINDOW_OPTS.icon = "icon.ico"
let bw = null; // The browser window to run the app in
let init = () => {
    bw = new electron.BrowserWindow(WINDOW_OPTS);
    bw.loadURL('file://' + __dirname + '/app.html');
    bw.webContents.openDevTools();
    bw.on('closed', () => bw = null);
}
electron.app.on('ready', init);