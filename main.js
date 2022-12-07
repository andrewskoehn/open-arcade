const { app, BrowserWindow, ipcMain, ipcRenderer } = require('electron');
const path = require('path');
const { spawn, exec } = require('child_process');

const createWindow = () => {
    const win = new BrowserWindow({
        width: 1000,
        height: 750,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
        },
        //fullscreen: true,
        autoHideMenuBar: true       // press ALT to reshow menu
    });

    win.loadFile('index.html');
};

function handleNewGame (event, game) {
    let command = 'cd C:/Users/Andrew Koehn/Desktop/MAME/mame0249 && mame.exe ' + game;
    exec(command, (error, stdout, stderr) => {
        console.log(stdout);
    });
    //console.log(command);
}

function handleGameListRequest() {
    const game_list = require('./games.json');
    return game_list;
}

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

