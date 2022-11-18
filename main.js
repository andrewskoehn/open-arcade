const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { spawn, exec } = require('child_process');

const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
        },
    });

    win.loadFile('index.html');
};

function handleNewGame (event, game) {

    /*let command = 'cd C:/Users/Andrew Koehn/Desktop/MAME/mame0141 && mame.exe ' + game;
    exec(command, (error, stdout, stderr) => {
        console.log(stdout);
    });*/
    console.log(game);
}

app.whenReady().then(() => {
    ipcMain.on('games', handleNewGame);
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

