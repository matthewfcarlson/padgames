var gameRoomRoot = "Dixit:";
var currentGames = {};
var DixitGame = require("../common/dixit");

function GetGameByID(gameID) {
    if (currentGames[gameID] == null) return null;
    return currentGames[gameID];
}

function ClearOutGamesList() {
    var cutoffTime = new Date().getTime() - (1000 * 60 * 60 * 2); //2 hour ago
    Object.keys(currentGames).filter(x => {
        return currentGames[x].creationDate < cutoffTime;
    }).forEach(x => {
        console.log("Clearing out game ", x)
        delete currentGames[x];
    });
}

function GetGameList() {
    if (currentGames == null || currentGames.length == 0) return [];

    ClearOutGamesList();

    return Object.keys(currentGames).map(x => {
        return {
            id: x,
            name: currentGames[x].name,
            state: x.state,
            numPlayers: currentGames[x].GetPlayers().length,
            createdBy: currentGames[x].GetPlayers()[0] || "Unknown",
            createdAt: currentGames[x].creationDate
        };
    }).filter(x => x.state != "gameover");
    //delete any game over an hour old
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
    //Call the function on our game engine and if it succeeded send it out
    var result = game.ApplyFunc(callName, args);
    if (result != 0) {
        console.error("REP CALL: We found an error:", result);
        return false;
    }
    var storedCall = game.GenCallObj(source, callName, args);
    game.StoreCall(storedCall);

    io.to(gameRoomRoot + gameId).emit(gameRoomRoot + "engine call", storedCall);
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

function JoinGame(io, gameId, playerName, socketID) {
    var game = GetGameByID(gameId);
    if (game == null) {
        console.error("JOIN GAME: this game does not exist");
        return false;
    }
    console.log("Attempting to add " + playerName + " to game: " + gameId);
    if (ReplicateCall(io, gameId, "server", "AddPlayer", [playerName])) {
        var playerIndex = GetPlayerIndex(gameId, playerName);
        if (game.sockets.length <= playerIndex) game.sockets.push("");
        game.sockets[playerIndex] = socketID;
        return playerIndex;
    }
    console.error("JOIN GAME: unable to replicate this call");
    return false;
}

function GetGameByID(gameID) {
    if (currentGames[gameID] == null) return null;
    return currentGames[gameID];
}

function Init(socket, io) {
    socket.on(gameRoomRoot + "connect", function () {
        //lists all the games that are available
        console.log("Connected to new socket");
        socket.join(gameRoomRoot);
        socket.emit(gameRoomRoot + "connected");
        socket.emit(gameRoomRoot + "list games", GetGameList());
    });
    socket.on(gameRoomRoot + "list games", function () {
        //lists all the games that are available
        socket.emit(gameRoomRoot + "list games", GetGameList());
    });
    socket.on(gameRoomRoot + "sync game", function (gameId, lastTimeSeen) {
        var game = GetGameByID(gameId);
        console.log("Sync request for game " + gameId);
        if (game == null) {
            console.error("SYNC GAME: this game does not exist");
            socket.emit(gameRoomRoot + "error", { msg: "This game does not exist: " + gameId, leave: true });
            return false;
        }
        game.commands.forEach(function (storedCall) {
            if (storedCall.time > lastTimeSeen) {
                //console.log("Playing back call",storedCall);
                socket.emit(gameRoomRoot + "engine call", storedCall);
            }
            else {
                console.log("Skipping command ", storedCall)
            }
        });
    });
    socket.on(gameRoomRoot + "create game", function (gameName) {
        var gameID = HashGameName(gameName);
        if (currentGames[gameID] != undefined || gameName == "") {
            console.error("You can't create the same game twice");
            socket.emit(gameRoomRoot + "error", { msg: "This already exists: " + gameId, leave: false });
            return false;
        }

        console.log("Creating a new game", gameID);

        currentGames[gameID] = DixitGame.CreateGame(gameID, function (callName, args) {
            console.log("Called on " + gameID, callname, args);
        });

        currentGames[gameID].name = gameName;
        currentGames[gameID].sockets = [];
        currentGames[gameID].players = [];
        currentGames[gameID].commands = [];
        currentGames[gameID].creationDate = new Date().getTime();

        socket.emit(gameRoomRoot + "list games", GetGameList());

        io.to(gameRoomRoot).emit(gameRoomRoot + "list games", GetGameList());
    });

    socket.on(gameRoomRoot + "join game", function (gameId, playerName) {
        var game = GetGameByID(gameId);
        if (game == null) {
            socket.emit(gameRoomRoot + "error", { msg: "This game does not exist: " + gameId, leave: true });
            console.error("SOCKET JOIN GAME: this game does not exist");
            return;
        }

        socket.join(gameRoomRoot + gameId);

        var playerIndex = JoinGame(io, gameId, playerName, socket.id);

        if (playerIndex === false) {
            console.error("Player tried to join with bogus playerIndex");
            return;
        }
        else {
            console.log("Broadcasting");

            socket.emit(
                gameRoomRoot + "set player", playerIndex
            );
        }
    });
}

module.exports = {
    Init
};