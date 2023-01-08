const { app, BrowserWindow, ipcMain, globalShortcut, dialog, shell} = require('electron');
const path = require('path');
const ipc = ipcMain;

let mainWindow;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 855,
    height: 655,
    minWidth: 855,
    minHeight: 655,
    maximizable: true,
    roundedCorners: true,
    frame: false,
    show: false,
    transparent: true,
    webPreferences: {
        nodeIntegration: true,
        devTools: true,
        contextIsolation: false
    }
  });

  mainWindow.webContents.openDevTools();
  mainWindow.loadFile(path.join(__dirname, 'index.html'));
  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.show();
  });
  
  ipc.on('close', () => {
    BrowserWindow.getFocusedWindow().close();
  });
  
  ipc.on('minimize', () => {
    BrowserWindow.getFocusedWindow().minimize();
  });
  
  ipc.on('maximize', () => {
    if(BrowserWindow.getFocusedWindow().isMaximized()) {
        BrowserWindow.getFocusedWindow().unmaximize();
    } else {
        BrowserWindow.getFocusedWindow().maximize();
    }
  });

  ipc.on('prompt', (event, obj) => {
    const promptWindow = new BrowserWindow({
      width: 400,
      height: 200,
      frame: false,
      transparent: true,
      roundedCorners: true,
      resizable: false,
      minimizable: false,
      maximizable: false,
      show: false,
      webPreferences: {
        nodeIntegration: true,
        devTools: true,
        contextIsolation: false
      }
    })
    promptWindow.loadFile(path.join(__dirname, '/prompt/prompt.html'));
    promptWindow.webContents.on('did-finish-load', () => {
      promptWindow.show();
      promptWindow.webContents.send('prompt-args', obj);
    })

    ipc.on("prompt-close", () => {
      BrowserWindow.getFocusedWindow().close();
    })

    ipc.on("prompt-submit", (event, arg) => {
      mainWindow.webContents.send("prompt-submit", arg);
      BrowserWindow.getFocusedWindow().close();
    })

    ipc.on("prompt-cancel", () => {
      mainWindow.webContents.send("prompt-cancel");
      BrowserWindow.getFocusedWindow().close();
    })

    ipc.on("alert-ok", () => {
      BrowserWindow.getFocusedWindow().close();
    })

    app.on("ready", () => {
      promptWindow();
    })
  })
};

app.on('ready', () => {
  createWindow();
})

app.disableHardwareAcceleration();

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});