function findClientsSocketByRoomId(roomId) {
  var res = [],
    room = io.sockets.adapter.rooms[roomId];
  if (room) {
    for (var id in room) {
      res.push(io.sockets.adapter.nsp.connected[id]);
    }
  }
  return res;
}

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

function GetPlayerGameByID(gameID){
  return currentGames[gameID].game;
}

function GetGameList() {
  return Object.keys(currentGames).map(x => {
    return { id: x, name: currentGames[x].name };
  });
}

function CheckPlayers(gameID, io) {
  var currentGame = currentGames[gameID].game;
  var gameRoom = gameRoomRoot + gameID;
  if (!currentGame.isPlaying) {
    currentSockets = io.in(gameRoom).connected;
    console.log(currentGame.players);

    /* currentGame.players = currentGame.players.filter(function(value, index) {
      var socketID = currentPlayerSockets[index];
      console.log("Checking " + value + " at socket#" + socketID);
      if (socketID == "AI") return true;
      var socket = currentSockets[socketID];
      if (socket != undefined) return true;
      else {
        console.error("Removing unknown socket" + socketID, socket);

        return false;
      }
      //TODO we need to figure out how to filter if this is a real socket
    });
    currentPlayerSockets = currentPlayerSockets.filter(function(value) {
      if (value == "AI") return true;
      return currentSockets[value] != undefined;
    });
    */
   currentGames[gameID].sockets.filter((socketID) => {
      if (currentSockets[socketID] == undefined) {
        console.error("Player is no longer connected",socketID);
        var value = currentPlayerSockets[socketID];
        console.log(socketID, value);
        //remove player that disconnected
        //how do we figure out if we have any disconnected players?
        currentGames[gameID].sockets[socketID] = null;
      }
      return true;
   });
    currentGames[gameID].sockets.forEach((socketID) => {
    
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
    //var playerName = socket.get("playerName");
    /*var index = currentPlayerSockets.indexOf(socket.id);
    if (index != -1 && !currentGame.isPlaying) {
      currentPlayerSockets.splice(index, 1);
      var playerName = currentGame.players.splice(index, 1);
      console.log("Disconnecting " + playerName + "@" + index);
    } else if (index != -1) {
      currentPlayerSockets[index] = null;
      console.log(
        "Disconnecting socket for player " + socket.id,
        currentPlayerSockets
      );
    } else {
      console.log(
        "Disconnecting an unknown socket " + socket.id,
        currentPlayerSockets
      );
    }
    CheckPlayers(io);
    */
   console.error("Disconnect logic is in need of rewriting?");
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
    currentGames[gameID].game = new SushiGo.Game();
    currentGames[gameID].game.deckSeed = Math.floor(Math.random() * 100000);

    io.to("SushiGo").emit("list sushi games", GetGameList());
  });
  socket.on("list sushi games", function() {
    //lists all the games that are available
    socket.join("SushiGo");
    socket.emit("list sushi games", GetGameList());
  });

  socket.on("sync sushi game", function(gameID) {
    var currentGame = GetPlayerGameByID(gameID);
    if (currentGame == null) console.error("Unable to find the game for this player!");
    socket.emit("sync sushi game", currentGame);
  });
  socket.on("join sushi game", function(gameID, playerName) {
    if (currentGames[gameID] == null) {
      console.error("You can't join a game that doesn't exist", gameID);
      return;
    }
    socket.join(gameRoomRoot + gameID);
    currentPlayerSockets[socket.id] = {
      gameID: gameID,
      player: playerName
    };
    //check currentGames[gameRoom].sockets
    currentGames[gameID].sockets.push(socket.id);
    console.log("Player joined the game " + gameID);
    var currentGame = GetPlayerGame(socket.id);

    if (currentGame == null) {
      socket.emit("error message", "This game does not exist");
      return;
    }

    if (playerName != null && playerName.length > 0) {
      var existingName = currentGame.players.indexOf(playerName);
      //if we are joining as a brand new player
      if (existingName == -1 && !currentGame.isPlaying) {
        currentGame.AddPlayer(playerName);
        console.log("Adding player " + playerName);
      } else if (currentPlayerSockets[existingName] == null) {
        //socket.emit("set players", currentGame.players);
        //socket.emit("set sushi player", existingName);
        //socket.emit("sync sushi game", currentGame);
        //TODO figure out how to transmit whole game state
        //currentPlayerSockets[existingName] = socket.id;
      } else {
        console.log("Player is trying to join twice!");
        socket.emit("error message", "This player has already joined");
        return;
      }
    }
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
    CheckPlayers(gameID,io);
  });

  socket.on("pick sushi card", function(cardIndex) {
    var playerIndex = currentPlayerSockets.indexOf(socket.id);
    if (playerIndex == -1) {
      console.error("Player ID is unknown", socket.id);
      socket.emit("error message", "Unknown User!");
      return;
    }
    var currentTurn = currentGame.turnNumber;

    if (currentPlayerSelections[playerIndex] != null) {
      console.error(playerIndex + " player has already tried to pick a card");
      socket.emit("error message", "You've already tried to pick a card");
      return;
    }
    if (!currentGame.SetAsideCard(playerIndex, cardIndex)) {
      console.error("Unable to pick this card for " + playerIndex, cardIndex);
      socket.emit("error message", "Unable to pick this card");
      return;
    }
    while (currentPlayerSelections.length < currentGame.players.length)
      currentPlayerSelections.push(null);
    currentPlayerSelections[playerIndex] = cardIndex;

    //check if we need to play for the AI
    currentPlayerSockets.forEach((x, index) => {
      if (x != "AI") return;
      if (currentGame.playersReady[index]) return;
      var move = currentGame.CalculateAIMoves(index);
      var result = currentGame.SetAsideCard(index, move);
      if (!result) {
        console.error("Unable to play for the AI");
        return;
      }
      io.to(gameRoom).emit("pick sushi card", index);
      currentPlayerSelections[index] = move;
    });

    console.log(currentPlayerSelections);

    if (currentTurn != currentGame.turnNumber) {
      io.to(gameRoom).emit("pick sushi cards", currentPlayerSelections);
      currentPlayerSelections = [];
    } else {
      io.to(gameRoom).emit("pick sushi card", playerIndex);
    }
  });
}

module.exports = { Init };
