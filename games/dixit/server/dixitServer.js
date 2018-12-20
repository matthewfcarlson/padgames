var gameRoomRoot = "Dixit:";
var currentGames = {};
var DixitGame = require("../common/dixit");

function GetGameByID(gameId) {
    if (currentGames[gameId] == null) return null;
    return currentGames[gameId];
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

function GetGameByID(gameId) {
    if (currentGames[gameId] == null) return null;
    return currentGames[gameId];
}

var gameId = HashGameName("test");
console.log("Creating a new game", gameId);
currentGames[gameId] = DixitGame.CreateGame(gameId,function(callName,args){
    console.log("Called on test: ",callname,args);
});
currentGames[gameId].name="test";
currentGames[gameId].sockets = [];
currentGames[gameId].players = [];
currentGames[gameId].commands = [];
currentGames[gameId]._server = true;
currentGames[gameId].creationDate = new Date().getTime();


function Init(socket, io) {
    socket.on(gameRoomRoot + "connect", function () {
        //lists all the games that are available
        console.log("Connected to new socket");
        socket.join(gameRoomRoot);
        socket.emit(gameRoomRoot + "connected");
        socket.emit(gameRoomRoot + "list games", GetGameList());
    });
    socket.on(gameRoomRoot + "listen", function (gameId) {
        var game = GetGameByID(gameId);
        if (game == null) {
            console.error("Listen: this game does not exist");
            socket.emit(gameRoomRoot + "error", {
                msg: "This game does not exist: " + gameId,
                leave: true
            });
            return false;
        }
        socket.join(gameRoomRoot + gameId);

    });
    socket.on(gameRoomRoot + "list games", function () {
        //lists all the games that are available
        socket.emit(gameRoomRoot + "list games", GetGameList());
    });
    socket.on(gameRoomRoot + "sync game", function (gameId, lastTimeSeen) {
        var game = GetGameByID(gameId);
        //console.log("Sync request for game " + gameId);
        if (game == null) {
            console.error("SYNC GAME: this game does not exist");
            socket.emit(gameRoomRoot + "error", {
                msg: "This game does not exist: " + gameId,
                leave: true
            });
            return false;
        }
        if (lastTimeSeen > 0 && game.commands.length == 0){
            socket.emit(gameRoomRoot + "error", {
                msg: "This game has changed fundamentally: " + gameId,
                leave: true
            });
            return;
        }
        game.commands.forEach(function (storedCall) {
            if (storedCall.time > lastTimeSeen) {
                //console.log("Playing back call",storedCall);
                socket.emit(gameRoomRoot + "engine call", storedCall);
            }
        });
    });
    socket.on(gameRoomRoot + "create game", function (gameName) {
        var gameId = HashGameName(gameName);
        if (currentGames[gameId] != undefined || gameName == "") {
            console.error("You can't create the same game twice");
            socket.emit(gameRoomRoot + "error", {
                msg: "This already exists: " + gameId,
                leave: false
            });
            return false;
        }

        console.log("Creating a new game", gameId);

        currentGames[gameId] = DixitGame.CreateGame(gameId, function (callName, args) {
            console.log("Called on " + gameId, callname, args);
        });

        currentGames[gameId].name = gameName;
        currentGames[gameId].sockets = [];
        currentGames[gameId].players = [];
        currentGames[gameId].commands = [];
        currentGames[gameId]._server = true;
        currentGames[gameId].creationDate = new Date().getTime();

        socket.emit(gameRoomRoot + "list games", GetGameList());

        io.to(gameRoomRoot).emit(gameRoomRoot + "list games", GetGameList());
    });

    socket.on(gameRoomRoot + "join game pad", function (gameId) {
        var game = GetGameByID(gameId);
        if (game == null) {
            socket.emit(gameRoomRoot + "error", {
                msg: "This game does not exist: " + gameId,
                leave: true
            });
            console.error("SOCKET JOIN GAME: this game does not exist");
            return;
        }

        socket.emit(gameRoomRoot + "set player", -1);

        ReplicateCall(io, gameId, "server", "AddPad", []);
        // add the pad player to the list of sockets
        if (game._padsockets == undefined) game._padsockets = [];
        game._padsockets.push(socket.id);

    });

    socket.on(gameRoomRoot + "join game", function (gameId, playerName) {
        var game = GetGameByID(gameId);
        if (game == null) {
            socket.emit(gameRoomRoot + "error", {
                msg: "This game does not exist: " + gameId,
                leave: true
            });
            console.error("SOCKET JOIN GAME: this game does not exist");
            return;
        }

        var playerIndex = JoinGame(io, gameId, playerName, socket.id);

        if (playerIndex === false) {
            console.error("Player tried to join with bogus playerIndex");
            return;
        } else {
            console.log("Broadcasting");
            //update the game list for everyone
            io.to(gameRoomRoot).emit(gameRoomRoot + "list games", GetGameList());
            socket.emit(
                gameRoomRoot + "set player", playerIndex
            );
        }
    });

    socket.on(gameRoomRoot + "rejoin game", function (gameId, playerName, playerIndex, previousSocket) {
        var game = GetGameByID(gameId);
        if (game == null) {
            socket.emit(
                gameRoomRoot + "error", {
                    msg: "This game does not exist: " + gameId,
                    leave: true
                }
            );
            console.error("SOCKET REJOIN GAME: this game does not exist");
            return;
        }

        var oldIndex = GetPlayerIndex(gameId, playerName);
        if (oldIndex == -1) {
            //player was not found
            console.log("Player " + playerName + " was not found ", gameId);
            return;
        }
        var oldSocket = game.sockets[oldIndex];

        console.log("Attempting to rejoin " + playerName + " to game " + gameId);

        if (playerIndex == oldIndex && oldSocket == previousSocket) {
            game.sockets[playerIndex] = socket.id;
            socket.emit(
                gameRoomRoot + "set player", playerIndex
            );
            console.log("Player rejoined as " + playerName);
            console.log("Redefined from ", oldSocket, socket.id)
        } else {
            console.error("Invalid rejoin", playerIndex, oldIndex, oldSocket, previousSocket);
        }
    });

    //relay any sort of thing we get from other clients to all the clients
    socket.on(gameRoomRoot + "engine call", function (gameId, callName, args) {
        var source = socket.id;
        var game = GetGameByID(gameId);
        if (game == null) {
            console.error("ENGINE CALL: this game does not exist");
            return false;
        }

        var result = ReplicateCall(io, gameId, source, callName, args);

    });
}

module.exports = {
    Init
};