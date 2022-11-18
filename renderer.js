//const information = document.getElementById('info');
//information.innerText = `This app is using Chrome (v${versions.chrome()}), Node.js (v${versions.node()}), and Electron (v${versions.electron()})`;

const setButton = document.getElementById('btn')
const gameInput = document.getElementById('game')
setButton.addEventListener('click', () => {
    const game = gameInput.value
    window.gameAPI.sendGame(game)
});