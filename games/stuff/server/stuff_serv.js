var currentGames = {};
var gameRoomRoot = "stuff:";
const questions = require("../common/questions").questions;

function GetNewQuestion(questionsList){
    if (questionsList == undefined) questionsList = [-1];
    if (!(questionsList instanceof Array)) questionsList = [-1];
    var goodQuest = false;
    var questionIndex = 0;
    var tries = 0;
    while (!goodQuest && tries < 50){
        questionIndex = Math.round(Math.random() * questions.length);
        if (questionsList.indexOf(questions[questionIndex]) == -1) goodQuest = true;
        tries++;
    }
    return questionIndex;
}
function HashGameName(gameName) {
    return Buffer.from(gameName).toString("hex");
}

function GetGameByID(gameID) {
    if (currentGames[gameID] == null) return null;
    return currentGames[gameID];
}

function GetGameList() {
    return Object.keys(currentGames).map(x => {
        return {
            id: x,
            name: currentGames[x].name
        };
    });
}

function JoinGame(gameId, playerName, socketID) {
    var game = GetGameByID(gameId);
    if (game == null) {
        return false;    
    }
    var playerIndex = game.players.indexOf(playerName);
    if (playerIndex == -1){
        game.players.push(playerName);
        game.sockets.push(socketID);
        return game.players.length;
    }
    game.players[playerIndex] = playerName;
    game.sockets[playerIndex] = socketID;
    
    return playerIndex+1;
    
}

function SyncGame(gameId, io) {
    var game = GetGameByID(gameId);
    if (game == null) {
        return;
    } else {
        io.to(gameRoomRoot + gameId).emit(gameRoomRoot + "sync game", game);
    }
}

function Init(socket, io) {
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
        currentGames[gameID].players = [];
        currentGames[gameID].questions = [];
        currentGames[gameID].sockets = [];
        currentGames[gameID].questions.unshift(GetNewQuestion());
        
        socket.emit(gameRoomRoot + "list games", GetGameList());

        io.to(gameRoomRoot).emit(gameRoomRoot + "list games", GetGameList());
    });
    socket.on(gameRoomRoot + "sync game", function (gameId) {
        console.log("Syncing to this server");
        var game = GetGameByID(gameId);
        if (game == null) {
            socket.emit(gameRoomRoot + "error", "This game does not exist: " + gameId);
        } else {
            socket.emit(gameRoomRoot + "sync game", game);
        }
    });

    socket.on(gameRoomRoot + "join game", function (gameId, playerName) {
        var game = GetGameByID(gameId);
        if (game == null) {
            socket.emit(gameRoomRoot + "error", "This game does not exist: " + gameId);
        } else {
            var result = JoinGame(gameId, playerName, socket.id);
            if (result === false) {
                socket.emit(gameRoomRoot + "error", "This game does not exist: " + gameId);
            } else {
                socket.join(gameRoomRoot + gameId);
                socket.emit(gameRoomRoot + "set player", result);
                SyncGame(gameId, io);
            }
        }
    });
    socket.on(gameRoomRoot + "submit answer", function (gameId) {
        var game = GetGameByID(gameId);
        if (game == null) {
            socket.emit(gameRoomRoot + "error", "This game does not exist: " + gameId);
        } else {
            var result = JoinGame(gameId, playerName);
            if (result === false) {
                socket.emit(gameRoomRoot + "error", "This game does not exist: " + gameId);
            } else {
                socket.join(gameRoomRoot + gameId);
                socket.emit(gameRoomRoot + "set player", result);
                SyncGame(gameId, io);
            }
        }
    });

}

module.exports = {
    Init
};