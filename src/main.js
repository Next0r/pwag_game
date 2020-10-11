const { create } = require("domain");
const { app } = require("electron");
const electron = require("electron");

function createWindow() {
  const win = new electron.BrowserWindow({
    width: 1600,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      worldSafeExecuteJavaScript: true,
    },
  });

  win.loadFile("./src/index.html");
  win.webContents.openDevTools();
}

app.whenReady().then(createWindow);
