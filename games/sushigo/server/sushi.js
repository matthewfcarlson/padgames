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

var currentGame = new SushiGo.Game();
var currentPlayerSelections = [];
var gameRoom = "sushi game";

currentGame.deckSeed = Math.floor(Math.random() * 100000);
var currentPlayerSockets = [];

function CheckPlayers(io) {
  if (!currentGame.isPlaying) {
    currentSockets = io.in(gameRoom).connected;

    currentGame.players = currentGame.players.filter(function(value, index) {
      var socketID = currentPlayerSockets[index];
      console.log("Checking " + value + " at socket#" + socketID);
      var socket = currentSockets[socketID];
      if (socket != undefined) return true;
      else {
        console.error("Unknown socket" + socketID, socket);

        return false;
      }
      //TODO we need to figure out how to filter if this is a real socket
    });
    currentPlayerSockets = currentPlayerSockets.filter(function(value) {
      return currentSockets[value] != undefined;
    });
    currentGame.players.forEach(function(value, index) {
      var socketID = currentPlayerSockets[index];
      console.log(
        "Sending Message to " +
          value +
          " at socket#" +
          socketID +
          " update to " +
          index
      );
      var socket = currentSockets[socketID];
      if (socket != undefined) socket.emit("set sushi player", index);
      else console.error("Unknown socket", socket);

      //TODO we need to figure out how to filter if this is a real socket
    });

    io.to(gameRoom).emit("set players", currentGame.players);
  }
}


function Init(socket, io) {
  socket.on("disconnect", function() {
    //var playerName = socket.get("playerName");
    var index = currentPlayerSockets.indexOf(socket.id);
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
  });
  socket.on("reset sushi game", function() {
    var currentGame = new SushiGo.Game();
    currentGame.deckSeed = Math.floor(Math.random() * 100000);
    io.to(gameRoom).emit("reset game", currentGame.deckSeed);
  });
  socket.on("sync sushi game", function() {
    socket.emit("sync sushi game", currentGame);
  });
  socket.on("join sushi game", function(playerName) {
    socket.join(gameRoom);

    if (playerName != null) {
      var existingName = currentGame.players.indexOf(playerName);
      if (existingName == -1 && !currentGame.isPlaying) {
        currentGame.AddPlayer(playerName);
        currentPlayerSockets.push(socket.id);
        console.log("Adding player " + playerName);
      } else if (currentPlayerSockets[existingName] == null) {
        socket.emit("set players", currentGame.players);
        socket.emit("set sushi player", existingName);
        socket.emit("sync sushi game", currentGame);
        //TODO figure out how to transmit whole game state
        currentPlayerSockets[existingName] = socket.id;
      } else {
        console.log("Player is trying to join twice!");
      }
    }

    //socket.set("playerName", playerName);

    io.to(gameRoom).emit("set deck seed", currentGame.deckSeed);
    CheckPlayers(io);
  });
  socket.on("start sushi game", function(playerName) {
    currentGame.StartGame();
    console.log("Starting game");

    io.to(gameRoom).emit("start game");
    CheckPlayers(io);
  });
  
  socket.on("pick sushi card", function(cardIndex) {
    var playerIndex = currentPlayerSockets.indexOf(socket.id);
    if (playerIndex == -1) {
      console.error("Player ID is unknown", socket.id);
      return;
    }
    var currentTurn = currentGame.turnNumber;

    while(currentPlayerSelections[playerIndex] != null){
      console.error(playerIndex+" player has already tried to pick a card");
      return;
    }
    if (!currentGame.SetAsideCard(playerIndex, cardIndex)) {
      console.error("Unable to pick this card for "+playerIndex,cardIndex);
      return;
    }
    while(currentPlayerSelections.length < playerIndex) currentPlayerSelections.push(null);
    currentPlayerSelections[playerIndex] = cardIndex;
    console.log(currentPlayerSelections);
    if (currentTurn != currentGame.turnNumber) {
      io.to(gameRoom).emit("pick sushi cards", currentPlayerSelections);
      currentPlayerSelections = [];
    }
    else {
      io.to(gameRoom).emit("pick sushi card", playerIndex);
    }
    
  });
}

module.exports = { Init };
