var currentGames = {};
var gameRoomRoot = "stuff:";
const questions = require("../common/questions").questions;

function GetNewQuestion(questionsList) {
    if (questionsList == undefined) questionsList = [-1];
    if (!(questionsList instanceof Array)) questionsList = [-1];
    var goodQuest = false;
    var questionIndex = 0;
    var tries = 0;
    while (!goodQuest && tries < 50) {
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

function GetPlayerIndex(gameId, socketID) {
    var game = GetGameByID(gameId);
    if (game == null) {
        return -1;
    }
    var playerIndex = game.sockets.indexOf(socketID);
    return playerIndex;
}

function JoinGame(gameId, playerName, socketID) {
    var game = GetGameByID(gameId);
    if (game == null) {
        return false;
    }
    var playerIndex = game.players.indexOf(playerName);
    if (playerIndex == -1) {
        game.players.push(playerName);
        game.sockets.push(socketID);
        game.playerAnswers.push("");
        game.scores.push(0);
        return game.players.length;
    }
    game.players[playerIndex] = playerName;
    game.sockets[playerIndex] = socketID;

    return playerIndex + 1;

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
    socket.on(gameRoomRoot + "connect", function () {
        //lists all the games that are available
        socket.join(gameRoomRoot);
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
        currentGames[gameID].state = "waiting"; //states are question, guessing, game over
        currentGames[gameID].players = [];
        currentGames[gameID].questions = [];
        currentGames[gameID].sockets = [];
        currentGames[gameID].playerAnswers = [];
        currentGames[gameID].scores = [];
        currentGames[gameID].questions.unshift(GetNewQuestion());

        socket.emit(gameRoomRoot + "list games", GetGameList());

        io.to(gameRoomRoot).emit(gameRoomRoot + "list games", GetGameList());
    });
    socket.on(gameRoomRoot + "sync game", function (gameId) {
        console.log("Syncing to this server");
        var game = GetGameByID(gameId);
        if (game == null) {
            socket.emit(gameRoomRoot + "error", "This game does not exist: " + gameId, true);
        } else {
            socket.emit(gameRoomRoot + "sync game", game);
        }
    });

    socket.on(gameRoomRoot + "answer", function (gameId, answer) {
        console.log("Got an answer for " + gameId, answer);
        var game = GetGameByID(gameId);
        if (game == null) {
            socket.emit(gameRoomRoot + "error", "This game does not exist: " + gameId, true);
            return;
        }
        var playerIndex = GetPlayerIndex(gameId, socket.id);
        if (game.playerAnswers[playerIndex] == "") {
            game.playerAnswers[playerIndex] = answer;
        } else {
            socket.emit(gameRoomRoot + "error", "You've already answered this round ");
            return;
        }
        console.log(game.playerAnswers);
        var allAnswered = game.playerAnswers.reduce((prev, curr) => prev && (curr != ""), true);
        console.log("All Answered " + allAnswered);
        //if all players have answered

        if (allAnswered) game.state = "guessing";
        SyncGame(gameId, io);
    });

    socket.on(gameRoomRoot + "guessed", function (gameId, guessedBy) {
        console.log("Got an guess for " + gameId, guessedBy);
        var game = GetGameByID(gameId);
        if (game == null) {
            socket.emit(gameRoomRoot + "error", "This game does not exist: " + gameId, true);
            return;
        }
        if (game.state != "guessing" && game.state != "guess") {
            socket.emit(gameRoomRoot + "error", "You can't guess just yet: " + gameId);
            return;
        }
        var playerIndex = GetPlayerIndex(gameId, socket.id);
        console.log("Player " + playerIndex + " has been guessed");
        if (game.playerAnswers[playerIndex] == "") {
            socket.emit(gameRoomRoot + "error", "You've already been guessed: " + gameId);
            return;
        }
        game.playerAnswers[playerIndex] = "";

        console.log("//TODO: add score to the guesser");
        var guesserIndex = guessedBy - 1;
        if (guesserIndex < 0 || guessedBy >= game.players.length) {
            socket.emit(gameRoomRoot + "error", "Invalid guessed by: " + guesserIndex);
            return;
        }
        game.scores[guessedBy - 1] += 1;

        var numGuessed = game.playerAnswers.reduce((prev, curr) => (curr == "") ? prev +1 : prev, 0);
        console.log("num guessed: "+numGuessed);
        //todo check if all players have been guessed
        //give them extra points        

        SyncGame(gameId, io);
    });

    socket.on(gameRoomRoot + "join game", function (gameId, playerName) {
        var game = GetGameByID(gameId);
        if (game == null) {
            socket.emit(gameRoomRoot + "error", "This game does not exist: " + gameId, true);
            return;
        }
        var result = JoinGame(gameId, playerName, socket.id);
        if (result === false) {
            socket.emit(gameRoomRoot + "error", "This game does not exist: " + gameId, true);
            return;
        }
        if (game.players.length > 2) game.state = "question";
        socket.join(gameRoomRoot + gameId);
        socket.emit(gameRoomRoot + "set player", result);
        SyncGame(gameId, io);


    });

}

module.exports = {
    Init
};