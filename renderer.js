var games = [];
var TOTAL_GAMES = 0;

const VIEW_SIZE = 29;    /* ODD NUMBERS ONLY */
const HALF_SIZE = Math.floor(VIEW_SIZE / 2);
const START_GAME = 0;
const GAME_ELEMENT = '<div tabindex="-1" class="game-name">';
const SCREENSHOT_DIR = "screenshots/"
const BANNER_DIR = "banners/"

var IN_GAME = false;
var currentGame = START_GAME;

startup();

// generate the inital games list shown (currently starts at top of games list)
async function startup() {

    games = await window.gameAPI.requestGameList();
    TOTAL_GAMES = games.length;

    // notify funky behavior because of ill-formatted games list
    if (VIEW_SIZE > TOTAL_GAMES || VIEW_SIZE % 2 == 0) {
        console.log("ERROR: VIEW_SIZE invalid -> change VIEW_SIZE and restart app");
    }
    if (START_GAME < 0 || START_GAME > VIEW_SIZE - 1) {
        console.log("ERROR: START_GAME invalid -> change START_GAME and restart app");
    }

    for (var i = 0; i < VIEW_SIZE; i++) {
        var gameName = games[i].title;
        var addLine = GAME_ELEMENT + gameName + '</div>';
        document.getElementById('game-list-container').insertAdjacentHTML("beforeEnd", addLine);
    }

    var divs = document.getElementById('game-list-container').getElementsByTagName('div');
    for (i = 0; i < VIEW_SIZE; i++) {
        divs[i].addEventListener("keydown", handleMoveGameSelector);
        divs[i].addEventListener('mousedown', function(e) {
            e.preventDefault();
        });
    }

    window.addEventListener("mousedown", function(e) {
        window.setTimeout(determineFocus, 1);
    });
    window.addEventListener("focus", function(e) {
        if(IN_GAME == true)
        {
            IN_GAME = false;
        }
    });

    updateGameScreenshot();
    updateGameBanner();
    updateGameCounter();
    determineFocus();
}

function determineFocus() {
    var divs = document.getElementById('game-list-container').getElementsByTagName('div');
    var currentDiv = 0;

    if (currentGame < HALF_SIZE)
        currentDiv = currentGame;
    else if (currentGame >= TOTAL_GAMES - HALF_SIZE)
        currentDiv = VIEW_SIZE - (TOTAL_GAMES - currentGame);
    else
        currentDiv = HALF_SIZE;

    document.getElementById("game-list-container").focus();
    divs[currentDiv].focus();
}

function handleMoveGameSelector(e) {
    var x = 0;

    if (e.key == "ArrowUp" && currentGame > 0)
        x = -1;
    else if (e.key == "ArrowDown" && currentGame < TOTAL_GAMES - 1)
        x = 1;
    else if (e.key == "1") {
        var romToSend = games[currentGame].id;
        if(IN_GAME == false)
        {
            window.gameAPI.sendGame(romToSend);
            IN_GAME = true;
        }
    }
    else if (e.key == "p") {
        window.gameAPI.shutdown();
    }
    else
        return;

    currentGame = ((currentGame + x) % TOTAL_GAMES);

    // adjust the visible games showing on the list if needed
    if (x == 1 && currentGame > HALF_SIZE && currentGame < TOTAL_GAMES - HALF_SIZE) {
        adjustVisibleGamesDown();
    }
    if (x == -1 && currentGame >= HALF_SIZE && currentGame < TOTAL_GAMES - (HALF_SIZE + 1)) {
        adjustVisibleGamesUp();
    }

    // update the game screenshot and game banner
    updateGameScreenshot();
    updateGameBanner();

    // update game number counter
    updateGameCounter();

    // focus on the correct game
    determineFocus();
}

function adjustVisibleGamesDown() {
    var gameName = games[currentGame + HALF_SIZE].title;
    var addLine = GAME_ELEMENT + gameName + '</div>';
    document.getElementById('game-list-container').insertAdjacentHTML("beforeEnd", addLine);

    var divs = document.getElementById('game-list-container').getElementsByTagName('div');
    divs[VIEW_SIZE].addEventListener("keydown", handleMoveGameSelector);
    divs[VIEW_SIZE].addEventListener('mousedown', function(e) {
        e.preventDefault();
    });

    divs[0].remove();
}

function adjustVisibleGamesUp() {
    var gameName = games[currentGame - HALF_SIZE].title;
    var addLine = GAME_ELEMENT + gameName + '</div>';
    document.getElementById('game-list-container').insertAdjacentHTML("afterBegin", addLine);

    var divs = document.getElementById('game-list-container').getElementsByTagName('div');
    divs[0].addEventListener("keydown", handleMoveGameSelector);
    divs[0].addEventListener('mousedown', function(e) {
        e.preventDefault();
    });

    divs[VIEW_SIZE].remove();
}

function updateGameScreenshot() {
    var gameID = games[currentGame].id;
    var link = SCREENSHOT_DIR + gameID + ".png";

    var screenshot = document.createElement("img");
    screenshot.src = link;
    screenshot.className = "actual-screenshot";
    screenshot.id = "screenshot";

    document.getElementById("game-screenshot-container").innerHTML = '';
    document.getElementById("game-screenshot-container").insertAdjacentElement("afterBegin", screenshot);
}

function updateGameBanner() {
    var gameID = games[currentGame].id;
    var link = BANNER_DIR + gameID + "_banner.png";

    var banner = document.createElement("img");
    banner.src = link;
    banner.className = "actual-banner";
    banner.id = "banner";

    document.getElementById("game-banner-container").innerHTML = '';
    document.getElementById("game-banner-container").insertAdjacentElement("afterBegin", banner);
}

function updateGameCounter() {
    var phrase = "Game " + (currentGame + 1) + " of " + TOTAL_GAMES + " selected";
    document.getElementById("game-number-container").textContent = phrase;
}
