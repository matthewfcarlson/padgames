
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
    if (ReplicateCall(io,gameId, socketID,"AddPlayer",playerName)){
        var playerIndex = GetPlayerIndex(gameId,playerName);
        if (game.sockets.length <= playerIndex) game.sockets.push("");
        game.sockets[playerIndex] = socketID;
        return playerIndex;
    }
    console.error("JOIN GAME: unable to replicate this ca");
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
    var result = game.CallFunc(callName,args);
    if (result != 0){
        console.error("REP CALL: We found an error", result);
        return false;
    }
    game.commands.push([source,callName,args]);
    
    io.to(gameRoomRoot).emit(gameRoomRoot + "engine call", source, callName, args);
    return true;
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
        currentGames[gameID] = ArgueGame.CreateGame(gameID,function(callName,args){

        });
        currentGames[gameID].name = gameName;
        currentGames[gameID].state = "waiting"; //states are question, guessing, game over
        currentGames[gameID].sockets = [];
        currentGames[gameID].commands = [];

        socket.emit(gameRoomRoot + "list games", GetGameList());

        io.to(gameRoomRoot).emit(gameRoomRoot + "list games", GetGameList());
    });

    //relay any sort of thing we get from other clients to all the clients
    socket.on(gameRoomRoot+"engine call", function(gameId, callName, args){
        console.log("Got an request from "+socket.id+" for game "+gameId);
        console.log(callName,args);
        var source = socket.id;
        var game = GetGameByID(gameId);
        if (game == null) {
            console.error("JOIN GAME: this game does not exist");
            return false;
        }

        var result = ReplicateCall(io,gameId,socket.id,callName,args);
        console.log(result)
        
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
            socket.emit(
                gameRoomRoot + "error",
                "This game does not exist: " + gameId,
                true
            );
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