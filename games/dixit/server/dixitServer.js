var gameRoomRoot = "Dixit:";
var currentGames = {};

function GetGameByID(gameID) {
    if (currentGames[gameID] == null) return null;
    return currentGames[gameID];
}

function GetGameList() {
    if (currentGames == null || currentGames.length == 0) return [];
    return Object.keys(currentGames).map(x => {
        return {
            id: x,
            name: currentGames[x].name,
            state: x.state,
            numPlayers: currentGames[x].players.length,
            createdBy: "unknown"
        };
    }).filter(x => x.state != "gameover");
}

function HashGameName(gameName) {
    return Buffer.from(gameName).toString("hex");
}

function ReplicateCall(io, gameId, source, callName, args) {
    var game = GetGameByID(gameId);
    if (game == null) {
        console.error("REP CALL: this game does not exist");
        return false;
    }
    //Call the function on our game engine and if it succedded send it out
    var result = game.ApplyFunc(callName, args);
    if (result != 0) {
        console.error("REP CALL: We found an error:", result);
        return false;
    }
    var storedCall = game.GenCallObj(source, callName, args);
    game.StoreCall(storedCall);

    io.to(gameRoomRoot).emit(gameRoomRoot + "engine call", storedCall);
    return true;
}

function GetPlayerIndex(gameId, playerName) {
    var game = GetGameByID(gameId);
    if (game == null) {
        return -1;
    }
    var playerIndex = game.GetPlayers().indexOf(playerName);
    return playerIndex;
}

function Init(socket, io) {
    socket.on(gameRoomRoot + "connect", function () {
        //lists all the games that are available
        socket.join(gameRoomRoot);
        socket.emit(gameRoomRoot + "connected");
        socket.emit(gameRoomRoot + "list games", GetGameList());
    });
    socket.on(gameRoomRoot + "list games", function () {
        //lists all the games that are available
        socket.join(gameRoomRoot);
        socket.emit(gameRoomRoot + "list games", GetGameList());
    });
    socket.on(gameRoomRoot + "create game", function (gameName) {
        var gameID = HashGameName(gameName);
        if (currentGames[gameID] != undefined || gameName == "") {
            console.error("You can't create the same game twice");
            return false;
        }

        console.log("Creating a new game", gameID);
        currentGames[gameID] = {};
        currentGames[gameID].name = gameName;
        currentGames[gameID].sockets = [];
        currentGames[gameID].players = [];
        currentGames[gameID].commands = [];

        socket.emit(gameRoomRoot + "list games", GetGameList());

        io.to(gameRoomRoot).emit(gameRoomRoot + "list games", GetGameList());
    });
}

module.exports = {
    Init
};