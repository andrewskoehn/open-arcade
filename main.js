const { app, BrowserWindow, ipcMain, ipcRenderer } = require('electron');
const path = require('path');
const { spawn, exec } = require('child_process');

const MAME_DIR = 'C:/Users/Admin/Desktop/MAME/mame0249/'

const createWindow = () => {
    const win = new BrowserWindow({
        width: 1200,  // change back to 1000 after removing auto open dev tools
        height: 900,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
        },
        //fullscreen: true,
        autoHideMenuBar: true,       // press ALT to reshow menu
        titleBarStyle: 'hidden',
        titleBarOverlay: {
            color: '#2f3241',
            symbolColor: '#74b1be',
        },
        useContentSize: true
    });

    win.loadFile('index.html');
    win.setAspectRatio(4/3)
    //win.webContents.openDevTools();
};

function handleNewGame (event, game) {
    let command = 'cd ' + MAME_DIR + ' && mame.exe ' + game;
    exec(command, (error, stdout, stderr) => {
        console.log(stdout);
    });
    console.log(command);
}

function handleGameListRequest() {
    const game_list = require('./games.json');
    return game_list;
}

app.disableHardwareAcceleration()

app.whenReady().then(() => {
    ipcMain.on('game_select', handleNewGame);
    ipcMain.handle('game_list', handleGameListRequest);
    
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

