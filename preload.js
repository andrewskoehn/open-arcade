const { contextBridge, ipcRenderer} = require('electron');

contextBridge.exposeInMainWorld('versions', {
    node: () => process.versions.node,
    chrome: () => process.versions.chrome,
    electron: () => process.versions.electron,
});

contextBridge.exposeInMainWorld('gameAPI', {
    sendGame: (game) => ipcRenderer.send('games', game),
    requestGameList: () => ipcRenderer.invoke('game-list')
});