const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { spawn, exec } = require('child_process');

const MAME_DIR = 'C:/Users/Admin/Desktop/MAME/mame0250/'

const createWindow = () => {
    const win = new BrowserWindow({
        width: 1200,  // width and height must be 4:3
        height: 900,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
        },
        fullscreen: true,
        //autoHideMenuBar: true,       // press ALT to reshow menu
        titleBarStyle: 'hidden',
        titleBarOverlay: {
            color: '#2f3241',
            symbolColor: '#74b1be',
        },
        useContentSize: true
    });

    win.loadFile('index.html');
    win.setAspectRatio(4/3)
};

function handleNewGame (event, game) {
    let command = 'cd ' + MAME_DIR + ' && mame.exe ' + game;
    exec(command, (error, stdout, stderr) => {
        console.log(stdout);
    });
    console.log(command);
}

function handleShutdown(event) {
    const shutdown = require('electron-shutdown-command');
    shutdown.shutdown({
        force: true,
        timerseconds: 2,
        sudo: true,
        debug: false,
        quitapp: true
    });
}

function handleGameListRequest() {
    const game_list = require('./games.json');
    return game_list;
}

app.disableHardwareAcceleration()

app.whenReady().then(() => {
    ipcMain.on('game_select', handleNewGame);
    ipcMain.on('shutdown', handleShutdown)
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

