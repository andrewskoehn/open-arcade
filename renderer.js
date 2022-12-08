let games = {
    g_0: {
        id: "dorunrun",
        name: "Do! Run Run",
        pic: 0
    },
    g_1: {
        id: "dowild",
        name: "Mr. Do's Wild Ride",
        pic: 1
    },
    g_2: {
        id: "mspacman",
        name: "Ms. Pac-Man",
        pic: 2
    },
    g_3: {
        id: "ldrun",
        name: "Lode Runner",
        pic: 3
    },
    g_4: {
        id: "llander",
        name: "Lunar Lander",
        pic: 4
    },
    g_5: {
        id: "rallyx",
        name: "Rally X",
        pic: 5
    },
    g_6: {
        id: "bouldash",
        name: "Boulder Dash 2",
        pic: 6
    },
    g_7: {
        id: "test7",
        name: "Test 7",
        pic: 7
    },
    g_8: {
        id: "test8",
        name: "Test 8",
        pic: 8
    },
    g_9: {
        id: "test9",
        name: "Test 9",
        pic: 9
    },
    g_10: {
        id: "test10",
        name: "Test 10",
        pic: 10
    },
    g_11: {
        id: "test11",
        name: "Test 11",
        pic: 11
    },
    g_12: {
        id: "test12",
        name: "Test 12",
        pic: 12
    }
};


//const test = require("./games.json");
//let games = window.gameAPI.requestGameList().then((response) => {return response.games;});
//console.log(games);

const TOTAL_GAMES = Object.values(games).length;
const VIEW_SIZE = 7;    /* ODD NUMBERS ONLY */
const HALF_SIZE = Math.floor(VIEW_SIZE / 2);
const START_GAME = 0;
const GAME_ELEMENT = '<div tabindex="-1" class="game-name">';

var currentGame = START_GAME;

// notify funky behavior because of ill-formatted games list
if (VIEW_SIZE > TOTAL_GAMES || VIEW_SIZE % 2 == 0) {
    console.log("ERROR: VIEW_SIZE invalid -> change VIEW_SIZE and restart app");
}
if (START_GAME < 0 || START_GAME > VIEW_SIZE - 1) {
    console.log("ERROR: START_GAME invalid -> change START_GAME and restart app");
}

startup();

// generate the inital games list shown (currently starts at top of games list)
function startup() {

    for (var i = 0; i < VIEW_SIZE; i++) {
        var gameName = Object.values(games)[i].name;
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
    else if (e.key == "Enter") {
        var romToSend = Object.values(games)[currentGame].id;
        window.gameAPI.sendGame(romToSend)
        //console.log(romToSend);
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
    var gameName = Object.values(games)[currentGame + HALF_SIZE].name;
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
    var gameName = Object.values(games)[currentGame - HALF_SIZE].name;
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
    var gameID = Object.values(games)[currentGame].id;
    var link = gameID + ".png";

    var screenshot = document.createElement("img");
    screenshot.src = link;
    screenshot.class = "actual-screenshot";
    screenshot.id = "screenshot";

    document.getElementById("game-screenshot-container").innerHTML = '';
    document.getElementById("game-screenshot-container").insertAdjacentElement("afterBegin", screenshot);
}

function updateGameBanner() {
    var gameID = Object.values(games)[currentGame].id;
    var link = gameID + "_banner.jpeg";

    var banner = document.createElement("img");
    banner.src = link;
    banner.class = "actual-banner";
    banner.id = "banner";

    document.getElementById("game-banner-container").innerHTML = '';
    document.getElementById("game-banner-container").insertAdjacentElement("afterBegin", banner);
}

function updateGameCounter() {
    var phrase = "Game " + (currentGame + 1) + " of " + TOTAL_GAMES + " selected";
    document.getElementById("game-number-container").textContent = phrase;
}

/*document.addEventListener('keypress', (e) => {
    //const game = gameInput.value
    //window.gameAPI.sendGame(game)
});*/
