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
    thickFrame: true,
    transparent: true,
    webPreferences: {
        nodeIntegration: true,
        devTools: true,
        contextIsolation: false
    },
    scrollBounce: true
  });

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