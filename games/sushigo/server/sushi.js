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
var gameRoom = "sushi game";

currentGame.deckSeed = Math.floor(Math.random() * 100000);
var currentPlayerSockets = [];

function Init(socket, io) {
  socket.on("disconnect", function() {
    //var playerName = socket.get("playerName");
    var index = currentPlayerSockets.indexOf(socket.id);
    if (index != 1 && currentGame.isPlaying) {
      currentPlayerSockets.splice(index, 1);
      var playerName = currentGame.players.splice(index, 1);
      console.log("Disconnecting " + playerName + "@" + index);
    }
    else {
        console.log("Disconnecting an unknown socket "+socket.id,currentPlayerSockets);
    }
    
  });
  socket.on("reset sushi game", function() {
    var currentGame = new SushiGo.Game();
    currentGame.deckSeed = Math.floor(Math.random() * 100000);
    io.to(gameRoom).emit("reset game", currentGame.deckSeed);
  });
  socket.on("join sushi game", function(playerName) {
    socket.join(gameRoom);
    if (playerName == null) playerName = "N/A";
    socket.emit("set sushi player",currentGame.players.length);
    currentGame.AddPlayer(playerName);
    currentPlayerSockets.push(socket.id);
    
    //socket.set("playerName", playerName);

    io.to(gameRoom).emit("set players", currentGame.players);
    io.to(gameRoom).emit("set deck seed", currentGame.deckSeed);
  });
  socket.on("start sushi game", function(playerName) {
    currentGame.StartGame();
    console.log("Starting game");
    io.to(gameRoom).emit("start game");
  });

  socket.on("pick sushi card", function(cardIndex){
    var playerIndex = currentPlayerSockets.indexOf(socket.id);
    if (index == -1){
        console.error("Player ID is unknown",socket.id);
    }
    currentGame.SetAsideCard(playerIndex,cardIndex);
    io.to(gameRoom).emit("pick sushi card",playerIndex,cardIndex);
  });
}

module.exports = { Init };
