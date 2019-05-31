
const gameRoomRoot = "Stocks:";

const StockGame = require("../common/stock_state");

var currentGame = StockGame.CreateGame();

function Init(socket, io) {
    socket.on(gameRoomRoot + "connect", function() {
        //lists all the games that are available
        socket.join(gameRoomRoot);
        socket.emit(gameRoomRoot + "connect");
        socket.emit(gameRoomRoot+"sync", currentGame);
    });

    socket.on(gameRoomRoot + "modify", function(value) {
        console.log("We got modification:",value);
        var prop_name = value["name"];
        currentGame[prop_name] = value["current"];
        io.to(gameRoomRoot).emit(gameRoomRoot+"sync", currentGame);
    });

}
module.exports = {
    Init
};
