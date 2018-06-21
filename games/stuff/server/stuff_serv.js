var currentGames = {};
var gameRoomRoot = "stuff:";

function HashGameName(gameName) {
    return Buffer.from(gameName).toString("hex");
}
function GetGameByID(gameID) {
    if (currentGames[gameID] == null) return null;
    return currentGames[gameID].game;
  }

function GetGameList() {
    return Object.keys(currentGames).map(x => {
        return {
            id: x,
            name: currentGames[x].name
        };
    });
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
        socket.emit(gameRoomRoot+"list games", GetGameList());

        io.to(gameRoomRoot).emit(gameRoomRoot+"list games", GetGameList());
    });
    socket.on(gameRoomRoot + "sync game", function (gameId) {
        var game = GetGameByID(gameId);
        if (game == null){
            socket.emit(gameRoomRoot+"error","This game does not exist: "+gameId);
        }
        else {
            socket.emit(gameRoomRoot+"sync game",game);
        }
        
    });

    socket.on(gameRoomRoot + "join game", function (gameId) {
        console.log("We need to join the game");
    });
}

module.exports = {
    Init
};