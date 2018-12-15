var SushiGo = require("../common/game");

//current games are stored by game ID
var currentGames = {};
var gameRoomRoot = "sushiGo:";
var currentPlayerSockets = [];

function GetPlayerGame(socketId) {
  var gameID = GetPlayerGameID(socketId);
  if (gameID == undefined || gameID == null) return null;
  return GetPlayerGameByID(gameID);
}
function GetPlayerGameID(socketId) {
  if (currentPlayerSockets[socketId] == undefined) return null;
  console.log("This player is currently in ", currentPlayerSockets[socketId]);
  return currentPlayerSockets[socketId].gameID;
}

function HashGameName(gameName) {
  return Buffer.from(gameName).toString("hex");
}

function GetPlayerGameByID(gameID) {
  if (currentGames[gameID] == null) return null;
  return currentGames[gameID].game;
}

function GetPlayerIndex(socketID) {
  var currentGame = GetPlayerGame(socketID);
  if (currentGame == null) return -1;
  var player = currentPlayerSockets[socketID];
  var playerIndex = currentGame.players.indexOf(player.player);
  return playerIndex;
}

function GetGameList() {
  return Object.keys(currentGames).map(x => {
    return { id: x, name: currentGames[x].name };
  });
}

function CheckPlayers(gameID, io) {
  if (currentGames[gameID] == null){ 
    console.error("Checking a game that doesn't exist: "+gameID);
    return false;

  }
  var currentGame = currentGames[gameID].game;
  var gameRoom = gameRoomRoot + gameID;
  if (!currentGame.isPlaying) {
    currentSockets = io.in(gameRoom).connected;
    console.log(currentGame.players);

    currentGames[gameID].sockets.filter(socketID => {
      if (currentSockets[socketID] == undefined) {
        console.error("Player is no longer connected", socketID);
        var value = currentPlayerSockets[socketID];
        console.log(socketID, value);
        //remove player that disconnected
        //how do we figure out if we have any disconnected players?
        currentGames[gameID].sockets[socketID] = null;
      }
      return true;
    });
    currentGames[gameID].sockets.forEach(socketID => {
      var value = currentPlayerSockets[socketID];
      console.log(socketID, value);
      //check if socketID is in currentSockets
      if (currentSockets[socketID] == undefined) {
        console.error("Player is no longer connected");
        return;
      }
      var socket = currentSockets[socketID];
      var playerIndex = currentGame.players.indexOf(value.player);
      console.log("Player is at " + playerIndex);
      //figure out where each player is
      socket.emit("set sushi player", playerIndex);
    });

    io.to(gameRoom).emit("set players", currentGame.players);
  }
}

function Init(socket, io) {
  socket.on("disconnect", function() {
    var currentGame = GetPlayerGame(socket.id);
    var gameID = GetPlayerGameID(socket.id);
    if (gameID == null) return;
    CheckPlayers(gameID, io);    
    var socketIndex = currentGames[gameID].sockets.indexOf(socket.id);

    currentPlayerSockets[socket.id] = null;
    
    console.error("Remove this socket from the game "+socketIndex, currentGames[gameID].sockets);
    currentGames[gameID].sockets.splice(socketIndex,1);
    //console.error("Disconnect logic is in need of rewriting?");
  });
  socket.on("create sushi game", function(gameName) {
    var gameID = HashGameName(gameName);
    if (currentGames[gameID] != undefined) {
      console.error("You can't create the same game twice");
      return false;
    }

    console.log("Creating a new game", gameID);
    currentGames[gameID] = {};
    currentGames[gameID].name = gameName;
    currentGames[gameID].sockets = [];
    currentGames[gameID].AI = [];
    currentGames[gameID].currentPlayerSelections = [];
    currentGames[gameID].game = new SushiGo.Game();
    currentGames[gameID].game.deckSeed = Math.floor(Math.random() * 100000);

    io.to("SushiGo").emit("list sushi games", GetGameList());
  });
  socket.on("list sushi games", function() {
    //lists all the games that are available
    socket.join("SushiGo");
    socket.emit("list sushi games", GetGameList());
  });

  socket.on("sushi:connect", function() {
    //lists all the games that are available
    socket.join("SushiGo");
    socket.emit("sushi:connected");
    socket.emit("list sushi games", GetGameList());
  });

  socket.on("sync sushi game", function(gameID) {
    var currentGame = GetPlayerGameByID(gameID);
    if (currentGame == null)
      console.error("Unable to find the game for this player!");
    socket.emit("sync sushi game", currentGame);
  });
  socket.on("join sushi game", function(gameID, playerName) {
    if (currentGames[gameID] == null) {
      console.error("You can't join a game that doesn't exist", gameID);
      socket.emit("error message", "This game doesn't exist");
      return;
    }
    
    if (playerName == null || playerName == ""){
      return;
    }

    var currentGame = GetPlayerGameByID(gameID)
    
    if (playerName != null && playerName.length > 0) {
      var existingName = currentGame.players.indexOf(playerName);
      //if we are joining as a brand new player
      if (existingName == -1 && !currentGame.isPlaying) {
        currentGame.AddPlayer(playerName);
        console.log("Adding player " + playerName);
      
      } else if (existingName == -1 && currentGame.isPlaying) {
        console.log("Player is joining after game is started!");
        socket.emit("error message", "Game has already started");
        return;
      } else if (existingName != -1 && currentGame.isPlaying) {        
        socket.emit("set sushi player", existingName);
        var foundPlayerSocket = false;
        for (var i=0;i<currentGames[gameID].sockets.length;i++){
          var currSocketID = currentGames[gameID].sockets[i];
          if (currentPlayerSockets[currSocketID].gameID == gameID && currentPlayerSockets[currSocketID].player === playerName) {
            foundPlayerSocket = true;
            break;
          }
        }
        if (foundPlayerSocket) {
          console.log("Player is joining after game is started!");
          socket.emit("error message", "You can't join the game from two places");
          return;
        }
        console.log("Letting user rejoin the game");
      } else {
        console.log("Player is trying to join twice!");
        socket.emit("error message", "This player has already joined");
        return;
      }
    }
    //sync the socket upto the current game
    socket.emit("set players", currentGame.players);    
    socket.emit("sync sushi game", currentGame);
        
    socket.join(gameRoomRoot + gameID);
    currentPlayerSockets[socket.id] = {
      gameID: gameID,
      player: playerName
    };
    
    currentGames[gameID].sockets.push(socket.id);

    console.log("Player "+playerName+" joined the game " + gameID);
    var currentGame = GetPlayerGame(socket.id);
    socket.emit("set deck seed", currentGame.deckSeed);
    CheckPlayers(gameID, io);
  });
  socket.on("start sushi game", function() {
    var currentGame = GetPlayerGame(socket.id);
    var gameID = GetPlayerGameID(socket.id);
    currentGame.StartGame();
    console.log("Starting game");

    io.to(gameRoomRoot + gameID).emit("start game");
    CheckPlayers(gameID, io);
  });

  socket.on("add sushi ai", function() {
    var currentGame = GetPlayerGame(socket.id);
    var gameID = GetPlayerGameID(socket.id);
    if (currentGame.isPlaying || currentGame.gameOver) {
      console.error("Player cannot add AI", socket.id);
      socket.emit(
        "error message",
        "You can't add an AI since the game has started"
      );
      return;
    }
    currentGame.AddAI();
    CheckPlayers(gameID, io);
  });

  socket.on("pick sushi card", function(cardIndex) {
    var playerIndex = GetPlayerIndex(socket.id);
    var currentGame = GetPlayerGame(socket.id);
    var gameID = GetPlayerGameID(socket.id);
    var gameRoom = gameRoomRoot + gameID;
    if (playerIndex == -1) {
      console.error("Player ID is unknown", socket.id);
      socket.emit("error message", "Unknown User!");
      return;
    }
    var currentTurn = currentGame.turnNumber;

    if (currentGames[gameID].currentPlayerSelections[playerIndex] != null) {
      console.error(playerIndex + " player has already tried to pick a card");
      socket.emit("error message", "You've already tried to pick a card");
      return;
    }

    while (
      currentGames[gameID].currentPlayerSelections.length <
      currentGame.players.length
    ) {
      currentGames[gameID].currentPlayerSelections.push(null);
    }

    //check if we need to play for the AI
    currentGame.players.forEach((x, index) => {
      if (x.substring(0, 4) != "[AI]") return;

      if (currentGame.playersReady[index]) return;
      console.log("Playing for " + x);
      var move = currentGame.CalculateAIMoves(index);
      var result = currentGame.SetAsideCard(index, move);
      if (!result) {
        console.error("Unable to play for the AI");
        return;
      }
      io.to(gameRoom).emit("pick sushi card", index);
      currentGames[gameID].currentPlayerSelections[index] = move;
    });

    //play the game as we need to
    if (!currentGame.SetAsideCard(playerIndex, cardIndex)) {
      console.error("Unable to pick this card for " + playerIndex, cardIndex);
      socket.emit("error message", "Unable to pick this card");
      return;
    }
    currentGames[gameID].currentPlayerSelections[playerIndex] = cardIndex;

    console.log(currentGames[gameID].currentPlayerSelections);

    if (currentTurn != currentGame.turnNumber) {
      io
        .to(gameRoom)
        .emit("pick sushi cards", currentGames[gameID].currentPlayerSelections);
      currentGames[gameID].currentPlayerSelections = [];
    } else {
      io.to(gameRoom).emit("pick sushi card", playerIndex);
    }
  });
}

module.exports = { Init };
