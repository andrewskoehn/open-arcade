const { contextBridge, ipcRenderer} = require('electron');

contextBridge.exposeInMainWorld('gameAPI', {
    sendGame: (game) => ipcRenderer.send('game_select', game),
    shutdown: () => ipcRenderer.send('shutdown'),
    requestGameList: () => ipcRenderer.invoke('game_list')
});