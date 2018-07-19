var currentGames = {};
var gameRoomRoot = "stuff:";
const questions = require("../common/questions").questions;
const aiAnswers = require("../common/questions").answers;
const mongoose = require("mongoose");

// Mongoose Schema definition
Schema = new mongoose.Schema({
    playerName: String,
    question: String,
    answer: String
});

mongoAnswer = mongoose.model("GOSAnswer", Schema);

console.log("Connecting to ", process.env.MONGOLAB_URI);
mongoose.connect(
    process.env.MONGOLAB_URI,
    function(error) {
        if (error) console.error(error);
        else console.log("mongo connected");
    }
);

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

function GetAIAnswer() {
    var answerIndex = Math.round(Math.random() * aiAnswers.length);
    return aiAnswers[answerIndex];
}

function HashGameName(gameName) {
    return Buffer.from(gameName).toString("hex");
}

function GetGameByID(gameID) {
    if (currentGames[gameID] == null) return null;
    return currentGames[gameID];
}

function GetGameList() {
    var currentOpenGames = currentGames.filter(x => x.state != "gameover");
    return Object.keys(currentOpenGames).map(x => {
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
    socket.on(gameRoomRoot + "connect", function() {
        //lists all the games that are available
        socket.join(gameRoomRoot);
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
        currentGames[gameID] = {};
        currentGames[gameID].name = gameName;
        currentGames[gameID].state = "waiting"; //states are question, guessing, game over
        currentGames[gameID].players = [];
        currentGames[gameID].questions = [];
        currentGames[gameID].playersConnected = [];
        currentGames[gameID].sockets = [];
        currentGames[gameID].playerAnswers = [];
        currentGames[gameID].votesToEnd = [];
        currentGames[gameID].currentPlayerTurn = 0;
        currentGames[gameID].scores = [];
        currentGames[gameID].questions.unshift(GetNewQuestion());

        socket.emit(gameRoomRoot + "list games", GetGameList());

        io.to(gameRoomRoot).emit(gameRoomRoot + "list games", GetGameList());
    });
    socket.on(gameRoomRoot + "sync game", function(gameId) {
        var game = GetGameByID(gameId);
        if (game == null) {
            socket.emit(
                gameRoomRoot + "error",
                "This game does not exist: " + gameId,
                "go_back"
            );
            return;
        } else {
            socket.emit(gameRoomRoot + "sync game", game);
        }
        console.log("Syncing to this server " + game.name + " " + game.state);
    });
    socket.on(gameRoomRoot + "vote end", function(gameId) {
        var game = GetGameByID(gameId);
        if (game == null) {
            socket.emit(
                gameRoomRoot + "error",
                "This game does not exist: " + gameId,
                "go_back"
            );
            return;
        }

        var playerIndex = GetPlayerIndex(gameId, socket.id);
        while (game.votesToEnd.length < game.players.length)
            game.votesToEnd.push(false);
        game.votesToEnd[playerIndex] = true;
        console.log(playerIndex + " voted to end the game");

        var votesToEndGame = game.votesToEnd.reduce((prev, curr) => curr ? prev + 1 : prev, 0);
        if (votesToEndGame > game.players.length / 2) {
            game.state = "gameover";
        }

        SyncGame(gameId, io);
    });

    socket.on(gameRoomRoot + "answer", function(gameId, answer) {
        console.log("Got an answer for " + gameId, answer);
        var game = GetGameByID(gameId);
        if (game == null) {
            socket.emit(
                gameRoomRoot + "error",
                "This game does not exist: " + gameId,
                true
            );
            return;
        }
        var playerIndex = GetPlayerIndex(gameId, socket.id);
        if (game.playerAnswers[playerIndex] == "") {
            game.playerAnswers[playerIndex] = answer;
        } else {
            socket.emit(
                gameRoomRoot + "error",
                "You've already answered this round "
            );
            return;
        }
        var currQuestion = questions[game.questions[0]];
        var data = {
            playerName: game.players[playerIndex],
            question: currQuestion,
            answer: answer
        };
        var answerDB = new mongoAnswer(data);
        // http://mongoosejs.com/docs/api.html#model_Model-save
        answerDB.save(function(err) {
            if (err != null) console.log("Unable to save the answer to the DB", err);
        });

        if (game.playerAnswers.length == game.players.length)
            game.playerAnswers.push(GetAIAnswer());

        console.log(game.playerAnswers);
        var allAnswered = game.playerAnswers.reduce(
            (prev, curr) => prev && curr != "",
            true
        );
        console.log("All Answered " + allAnswered);
        //if all players have answered

        if (allAnswered) game.state = "guessing";
        SyncGame(gameId, io);
    });

    socket.on(gameRoomRoot + "guessed", function(gameId, guessedBy) {
        console.log("Got an guess for " + gameId, guessedBy);
        var game = GetGameByID(gameId);
        if (game == null) {
            socket.emit(
                gameRoomRoot + "error",
                "This game does not exist: " + gameId,
                true
            );
            return;
        }
        if (game.state != "guessing" && game.state != "guess") {
            socket.emit(
                gameRoomRoot + "error",
                "You can't guess just yet: " + gameId
            );
            return;
        }

        var guesserIndex = guessedBy;
        if (guesserIndex < 0 || guessedBy >= game.players.length) {
            socket.emit(
                gameRoomRoot + "error",
                "Invalid guessed by: " + guesserIndex
            );
            return;
        }

        var playerIndex = GetPlayerIndex(gameId, socket.id);
        console.log("Player " + playerIndex + " has been guessed");
        if (game.playerAnswers[playerIndex] == "") {
            socket.emit(
                gameRoomRoot + "error",
                "You've already been guessed: " + gameId
            );
            return;
        }
        game.scores[guesserIndex] += 1;
        game.playerAnswers[playerIndex] = "";

        var aiIndex = game.players.length;

        var numNotGuessed = game.playerAnswers.reduce(
            (prev, curr, index) => (curr != "" && index != aiIndex ? prev + 1 : prev),
            0
        );
        console.log("num not guessed: " + numNotGuessed);

        if (numNotGuessed < 2) {
            //give two extra points to the last player left
            var lastPlayerIndex = game.playerAnswers.reduce(
                (prev, curr, index) => (curr != "" && index != aiIndex ? index : prev), -1
            );
            console.log("last player standing: " + lastPlayerIndex);
            game.playerAnswers[lastPlayerIndex] = "";
            game.scores[lastPlayerIndex] += 2;
            //get rid of AI answer
            if (aiIndex == game.playerAnswers.length - 1) game.playerAnswers.pop();
            game.state = "question";
            var newQuestion = GetNewQuestion(game.questions);
            game.questions.unshift(newQuestion);
        }
        //todo check if all players have been guessed
        //give them extra points

        SyncGame(gameId, io);
    });

    socket.on(gameRoomRoot + "join game", function(gameId, playerName) {
        var game = GetGameByID(gameId);
        if (game == null) {
            socket.emit(
                gameRoomRoot + "error",
                "This game does not exist: " + gameId,
                true
            );
            return;
        }
        if (playerName == "AI") {
            socket.emit(gameRoomRoot + "error", "You can't be named AI " + gameId);
            return;
        }
        var oldPlayerLength = game.players.length;
        var result = JoinGame(gameId, playerName, socket.id);

        if (result === false) {
            socket.emit(
                gameRoomRoot + "error",
                "This game does not exist: " + gameId,
                true
            );
            return;
        }

        if (game.players.length == oldPlayerLength) {
            var playerJoinIndex = game.players.indexOf(playerName);
            if (playerJoinIndex == -1) {
                console.log("SERIOUS ERROR TRYING TO JOIN PLAYER");
                game.playersConnected[playerJoinIndex] = true;
            }
            game.playersConnected.push(true);
        } else {}

        if (
            game.players.length > 2 &&
            (game.state == "waiting" || oldPlayerLength != game.players.length)
        )
            game.state = "question";
        socket.join(gameRoomRoot + gameId);
        socket.emit(gameRoomRoot + "set player", result);
        SyncGame(gameId, io);
    });
}

module.exports = {
    Init
};