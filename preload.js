const { contextBridge, ipcRenderer} = require('electron');

contextBridge.exposeInMainWorld('gameAPI', {
    sendGame: (game) => ipcRenderer.send('game_select', game),
    requestGameList: () => ipcRenderer.invoke('game_list')
});