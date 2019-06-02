
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

    socket.on(gameRoomRoot + "reset", function() {
        //lists all the games that are available
        currentGame = StockGame.CreateGame();
        io.to(gameRoomRoot).emit(gameRoomRoot+"sync", currentGame);
    });

    socket.on(gameRoomRoot + "modify", function(value) {
        console.log("We got modification:",value);
        
        var prop_name = value["name"];
        var old_value = currentGame[prop_name].slice(); //copy by value
        currentGame[prop_name] = value["current"];
        currentGame.Fix(); //attempt to fix things?
        if (!currentGame.Verify()) {
            //Roll back the change
            currentGame[prop_name] = old_value;
            console.log("Invalid Game modification, rolling back");
            socket.emit(gameRoomRoot+"sync", currentGame);
        }
        else io.to(gameRoomRoot).emit(gameRoomRoot+"sync", currentGame);
    });

}
module.exports = {
    Init
};
