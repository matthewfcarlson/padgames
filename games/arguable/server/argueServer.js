
var currentGames = {};
var ArgueGame = require("../common/argueGame");
var gameRoomRoot = "Argue:";

function GetSocketIndex(gameId, socketID) {
    var game = GetGameByID(gameId);
    if (game == null) {
        return -1;
    }
    var playerIndex = game.sockets.indexOf(socketID);
    return playerIndex;
}

function GetPlayerIndex(gameId, playerName){
    var game = GetGameByID(gameId);
    if (game == null) {
        return -1;
    }
    var playerIndex = game.GetPlayers().indexOf(playerName);
    return playerIndex;
}

function JoinGame(io,gameId, playerName, socketID) {
    var game = GetGameByID(gameId);
    if (game == null) {
        console.error("JOIN GAME: this game does not exist");
        return false;
    }
    console.log("Attempting to add "+playerName+" to game: "+gameId);
    if (ReplicateCall(io,gameId, "server","AddPlayer",[playerName])){
        var playerIndex = GetPlayerIndex(gameId,playerName);
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

function ReplicateCall(io,gameId, source, callName, args){
    var game = GetGameByID(gameId);
    if (game == null) {
        console.error("REP CALL: this game does not exist");
        return false;
    }
    //Call the function on our game engine and if it succedded send it out
    var result = game.ApplyFunc(callName,args);
    if (result != 0){
        console.error("REP CALL: We found an error:", result);
        return false;
    }
    var storedCall = game.GenCallObj(source, callName, args);
    game.StoreCall(storedCall);
    
    io.to(gameRoomRoot).emit(gameRoomRoot + "engine call",storedCall);
    return true;
}

var gameID = HashGameName("test");
console.log("Creating a new game", gameID);
currentGames[gameID] = ArgueGame.CreateGame(gameID,function(callName,args){
    console.log("Called on test: ",callname,args);
});
currentGames[gameID].name="test";
currentGames[gameID].sockets = [];
currentGames[gameID].commands = [];

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
        currentGames[gameID] = ArgueGame.CreateGame(gameID,function(callName,args){
            console.log("Called on "+gameID, callname,args);
        });
        currentGames[gameID].name=gameName;
        currentGames[gameID].sockets = [];
        currentGames[gameID].commands = [];

        socket.emit(gameRoomRoot + "list games", GetGameList());

        io.to(gameRoomRoot).emit(gameRoomRoot + "list games", GetGameList());
    });

    socket.on(gameRoomRoot+"sync game", function(gameId){
        var game = GetGameByID(gameId);
        if (game == null) {
            console.error("SYNC GAME: this game does not exist");
            return false;
        }
        game.commands.forEach(function(storedCall){
            console.log("Playing back call",storedCall);
            socket.emit(gameRoomRoot+"engine call",storedCall);
        });
    });

    //relay any sort of thing we get from other clients to all the clients
    socket.on(gameRoomRoot+"engine call", function(gameId, callName, args){
        var source = socket.id;
        var game = GetGameByID(gameId);
        if (game == null) {
            console.error("JOIN GAME: this game does not exist");
            return false;
        }

        var result = ReplicateCall(io,gameId,source,callName,args);
        
    });
    socket.on(gameRoomRoot + "rejoin game", function(gameId, playerName, playerIndex, previousSocket) {
        var game = GetGameByID(gameId);
        if (game == null) {
            socket.emit(
                gameRoomRoot + "error",
                "This game does not exist: " + gameId,
                true
            );
            console.error("SOCKET REJOIN GAME: this game does not exist");
            return;
        }

        var oldIndex = GetPlayerIndex(gameID,playerName);
        var oldSocket = game.sockets[oldIndex];
        return;
        if (playerIndex == oldIndex && oldSocket == previousSocket){
            game.sockets[playerIndex] = socket.id;
            socket.emit(
                gameRoomRoot + "set player", playerIndex
            );
            console.log("Player rejoined as "+playerName);
        }
    });
    socket.on(gameRoomRoot + "join game", function(gameId, playerName) {
        var game = GetGameByID(gameId);
        if (game == null) {
            socket.emit(
                gameRoomRoot + "error",
                "This game does not exist: " + gameId,
                true
            );
            console.error("SOCKET JOIN GAME: this game does not exist");
            return;
        }
        
        var playerIndex = JoinGame(io,gameId, playerName, socket.id);

        if (playerIndex === false) {
            console.error("Player tried to join with bogus playerIndex");
            return;
        }
        else {
            socket.emit(
                gameRoomRoot + "set player", playerIndex
            );
        }
    });
        
}


module.exports = {
    Init
};