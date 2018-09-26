
var currentGames = {};
var ArgueGame = require("../common/argueGame");
var gameRoomRoot = "Argue:";

function SyncGame(gameId, io) {
    var game = GetGameByID(gameId);
    if (game == null) {
        return;
    } else {
        io.to(gameRoomRoot + gameId).emit(gameRoomRoot + "sync game", game);
    }
}

function GetGameList() {
    if (currentGames == null || currentGames.length == 0) return [];
    return Object.keys(currentGames).map(x => {
        return {
            id: x,
            name: currentGames[x].name,
            state: x.state
        };
    }).filter(x => x.state != "gameover");
}

function HashGameName(gameName) {
    return Buffer.from(gameName).toString("hex");
}



function Init(socket, io) {
    socket.on(gameRoomRoot + "connect", function() {
        //lists all the games that are available
        socket.join(gameRoomRoot);
        socket.emit(gameRoomRoot+"connected");
    });
    socket.on(gameRoomRoot + "list games", function() {
        //lists all the games that are available
        socket.join(gameRoomRoot);
        socket.emit(gameRoomRoot + "list games", GetGameList());
    });
    socket.on(gameRoomRoot + "create game", function(gameName) {
        var gameID = HashGameName(gameName);
        if (currentGames[gameID] != undefined || gameName == "") {
            console.error("You can't create the same game twice");
            return false;
        }

        console.log("Creating a new game", gameID);
        currentGames[gameID] = ArgueGame.CreateGame();
        currentGames[gameID].name = gameName;
        currentGames[gameID].state = "waiting"; //states are question, guessing, game over
        currentGames[gameID].sockets = [];

        socket.emit(gameRoomRoot + "list games", GetGameList());

        io.to(gameRoomRoot).emit(gameRoomRoot + "list games", GetGameList());
    });
}


module.exports = {
    Init
};