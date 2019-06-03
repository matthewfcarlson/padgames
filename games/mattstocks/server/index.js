
const gameRoomRoot = "Stocks:";

const StockGame = require("../common/stock_state");
const brain = require("brain.js");

var currentGame = StockGame.CreateGame();
var defaultStock = StockGame.CreateShare("MATT", 50);
var defaultStock2 = StockGame.CreateShare("MATT2", 20);
currentGame.AddShare(defaultStock);
currentGame.AddShare(defaultStock2);

//stock data
/*
const microsoft = require("./microsoft_data");
const apple = require("./microsoft_data");
const facebook = require("./facebook_data");

const MSFT_data = microsoft.data.map(microsoft.scaledown);
const AAPL_data = apple.data.map(apple.scaledown);
const FB_data = facebook.data.map(facebook.scaledown);

const trainingData = [
    MSFT_data,
    AAPL_data,
    FB_data
];

const net = new brain.recurrent.LSTMTimeStep({
    inputSize: 2,
    hiddenLayers: [8, 8],
    outputSize: 2
});
console.log("Training machine learning data"); //, trainingData);
net.train(trainingData, {
    learningRate: 0.005,
    logPeriod: 25,
    iterations: 2000,
    errorThresh: 0.04, //0.02
    log: (stats) => console.log(stats)
});
//console.log(net.toJSON());
var start_data  = trainingData[0].slice(0,4);
var all_prices = [0,0,];
for (var i=0;i<25;i++) {
    var prices = net.forecast(start_data,3);
    var display_price = 0;
    for (var j=0; j < prices.length; j++){
        var price = prices[j];
        display_price = microsoft.getPrice(price);
        if (display_price != all_prices[all_prices.length-1] || display_price != all_prices[all_prices.length-2]) break;
    }
    start_data.push(price);
    all_prices.push(display_price);
    console.log(display_price);
}
*/
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

    socket.on(gameRoomRoot + "advance", function(){
        //advance the day
        currentGame["g_day"] += 1;
        //Update prices
        for (var stock_index in currentGame["g_shares"]){
            //update the price
            var stock = currentGame["g_shares"][stock_index];
            console.log(stock);
        }
        io.to(gameRoomRoot).emit(gameRoomRoot+"sync", currentGame);
    });

    socket.on(gameRoomRoot + "modify", function(value) {
        console.log("We got modification:",value);
        
        var prop_name = value["name"];
        var old_value = currentGame[prop_name];
        if (typeof old_value == "array")  old_value = currentGame[prop_name].slice(); //copy by value
        currentGame[prop_name] = value["current"];
        currentGame.Fix(); //attempt to fix things?
        
        if (!currentGame.Verify()) {
            //Roll back the change
            currentGame[prop_name] = old_value;
            console.log("Invalid Game modification, rolling back");
            socket.emit(gameRoomRoot+"sync", currentGame);
            return;
        }

        if (prop_name == "g_gameStarted") {
            //distribute the cash to all the players
            for (var player in currentGame.g_players){
                currentGame.g_players[player].p_cash = currentGame.g_defaultCash;
            }
        }
        io.to(gameRoomRoot).emit(gameRoomRoot+"sync", currentGame);
    });

}
module.exports = {
    Init
};
