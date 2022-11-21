//const information = document.getElementById('info');
//information.innerText = `This app is using Chrome (v${versions.chrome()}), Node.js (v${versions.node()}), and Electron (v${versions.electron()})`;
//const setButton = document.getElementById('btn')
//const gameInput = document.getElementById('game')

const games = {
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
        pic: 11
    },
};

const numGames = Object.values(games).length;
//console.log(numGames);
const viewSize = 7;

var currentGame = 0;
for(var i = 0; i < viewSize; i++)
{
    var objname = Object.values(games)[i].name;
    document.getElementById('testBox').innerHTML += '<div tabindex="-1">' + objname + '</div>';
}

var divs = document.getElementById('testBox').getElementsByTagName('div');
for(i = 0; i < viewSize; i++)
{
    divs[i].onkeydown = handleGameMove;
}

divs[currentGame].focus();

function handleGameMove(e)
{
    var divs = document.getElementById('testBox').getElementsByTagName('div');

    var x = 0;
    if(e.key == "ArrowUp" && currentGame > 0)
        x = -1;
    else if(e.key == "ArrowDown" && currentGame < numGames-1)
        x = 1;
    else if(e.key == "Enter")
    {
        var romToSend = Object.values(games)[currentGame].id;
        window.gameAPI.sendGame(romToSend)
    }
    else
        return;
    //console.log(currentGame);
    currentGame = ((currentGame+x)%numGames);
    //console.log("cGame = "+currentGame);
    
    var currentDiv = 0;
    if(currentGame < 3)
        currentDiv = currentGame;
    else if(currentGame >= numGames-3)
        currentDiv = 7-(numGames-currentGame);
    else
        currentDiv = 3;
    //console.log("cDiv = " + currentDiv);

    
    if(x==1 && currentGame > 3 && currentGame < numGames-3)
    {
        adjustVisibleGames(x);
    }
    if(x==-1 && currentGame >= 3 && currentGame < numGames-4)
    {
        adjustVisibleGames(x);
    }

    divs[currentDiv].focus();
    //console.log(Object.values(games)[currentGame].name);
    
}

function adjustVisibleGames(down)
{
    if(down == 1)
    {
        var replaceLine = '<div tabindex="-1">' + Object.values(games)[currentGame+3].name + '</div>';
        document.getElementById('testBox').insertAdjacentHTML("beforeend",replaceLine);

        var divs = document.getElementById('testBox').getElementsByTagName('div');
        divs[divs.length-1].onkeydown = handleGameMove;

        divs[0].remove();
    }
    else
    {
        var replaceLine = '<div tabindex="-1">' + Object.values(games)[currentGame-3].name + '</div>';
        document.getElementById('testBox').insertAdjacentHTML("afterBegin",replaceLine);

        var divs = document.getElementById('testBox').getElementsByTagName('div');
        divs[0].onkeydown = handleGameMove;
        
        divs[divs.length-1].remove();
    }
}

/*document.addEventListener('keypress', (e) => {
    //const game = gameInput.value
    //window.gameAPI.sendGame(game)
});*/
