const { create } = require("domain");
const { app } = require("electron");
const electron = require("electron");
const { handleStartMenu } = require("./game.handleStartMenu");

function createWindow() {
  const win = new electron.BrowserWindow({
    width: 1920,
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

