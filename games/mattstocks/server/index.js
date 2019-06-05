
const gameRoomRoot = "Stocks:";

const StockGame = require("../common/stock_state");
const brain = require("brain.js");

var currentGame = StockGame.CreateGame();
currentGame.AddShare(StockGame.CreateShare("BANANA", 50)); //BANANA
currentGame.AddShare(StockGame.CreateShare("NESQUIK", 20)); //NASDAQ
currentGame.AddShare(StockGame.CreateShare("DIDNEY", 60)); //DISNEY
currentGame.AddShare(StockGame.CreateShare("VAPOR", 10)); // STEAM

function GetNextPrice(stock){
    //TODO figure out how to get a new price (percentage based)
    var volume = stock["s_volume"];
    var value = stock["s_volume_v"];
    var price = stock["s_price"];
    var owned = stock["s_owned"];
    var last_price = stock["s_history"][stock.s_history.length-1];
    if (owned == 0) owned = 1;
    var owned_factor = (volume) / owned;  // up to a double factor
    var min = -2.25 * (1+owned_factor); //max of 5% up
    var max = 2.5 * (1+owned_factor); // max of 5% down

    if (last_price > price){
        max -= 0.5; // if we're going down, go down
    }
    if (last_price < price){
        min += 0.5 // if we're going up, go up
    }
    
    
    if (value < 0){ // if people are selling
        max -= owned_factor; // make max smaller
        min += owned_factor; //make the min bigger
    }
    else if (value > 0){ // if people buying
        max -= owned_factor; //make the max smaller
        min += owned_factor; //make the min bigger
    }
    if (volume == 0){
        min -= 0.25; // if no one is selling, make it go down?
    }
    if (price < 10) min = 0;
    var percentage_change = 0;
    var range = max - min;
    while (percentage_change == 0){
        percentage_change = Math.random()*range + min;
    }
    
    var price_change = price * (percentage_change / 100.0);
    if (price_change > 0) price_change = Math.ceil(price_change);
    if (price_change < 0) price_change = Math.floor(price_change);
    console.log(stock.s_name+" vol:"+volume+" val:"+value+" factor:"+owned_factor+" max:"+max+" min:"+min+" perc:"+percentage_change+"% Pricedelta:"+price_change);
    return price + price_change;
}

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
            var price = stock["s_price"];
            currentGame["g_shares"][stock_index]["s_price"] = GetNextPrice(stock);
            currentGame["g_shares"][stock_index]["s_volume"] = 0;
            currentGame["g_shares"][stock_index]["s_volume_v"] = 0;
            
            currentGame["g_shares"][stock_index]["s_day"] += 1;
            currentGame["g_shares"][stock_index]["s_history"].push(price);
            //console.log(stock);
        }
        io.to(gameRoomRoot).emit(gameRoomRoot+"sync", currentGame);
    });

    socket.on(gameRoomRoot+"order", function(order){
        var type = order["type"];
        var stock = parseInt(order["stock"]);
        var quantity = parseInt(order["count"]);
        var playerId = parseInt(order["player"]);
        if (type == "BUY"){
            console.log("Trying to buy "+quantity+" of "+ stock);
            if (stock >= currentGame.g_shares.length || stock < 0) return;
            if (playerId < 0) return;
            if (quantity < 1) return;
            var cost = currentGame.g_shares[stock]["s_price"] * quantity;
            console.log("Cost" + cost);
            //figure out the cost
            if (currentGame.g_players[playerId].p_cash < cost){
              console.log("This costs too much");
              return;
            }
            currentGame.g_players[playerId].p_cash -= cost;
            //give them the shares
            var share = {
                s_name: currentGame.g_shares[stock].s_name,
                s_price: currentGame.g_shares[stock].s_price,
                s_day: currentGame.g_day,
                s_id: stock
            };
            console.log("Purchased for "+playerId);
            for (var i=0;i<quantity; i++){
                currentGame.g_players[playerId].p_shares.push(share);
            }
            // Add to volume indicator
            currentGame.g_shares[stock].s_volume += quantity;
            currentGame.g_shares[stock].s_owned += quantity;
            currentGame.g_shares[stock].s_volume_v += quantity;

        }
        else if (type == "SELL"){
            console.log("Trying to sell "+quantity+" of "+ stock+ " for "+ playerId);
            if (stock >= currentGame.g_shares.length || stock < 0) return;
            if (quantity < 1) return;
            if (playerId < 0) return;
            //check to make sure we have enough
            var stock_symbol = currentGame.g_shares[stock].s_name;
            var stock_count = currentGame.g_players[playerId].p_shares.filter((x)=>{
                return x.s_name == stock_symbol;
            }).length;

            if (stock_count < quantity){
                console.log("We only have "+stock_count+" stocks");
                return;
            }
            var price = currentGame.g_shares[stock]["s_price"] * quantity;
            console.log("Revenue" + price);
            //calculate the profit (taxes?)
            //remove the stocks we have
            var stocks_to_remove = quantity;
            currentGame.g_players[playerId].p_shares = currentGame.g_players[playerId].p_shares.filter((x)=>{
                if (x.s_name == stock_symbol && stocks_to_remove > 0) {
                    stocks_to_remove --;
                    return false;
                }
                else return true;
            });
            //add the cash to the player price
            currentGame.g_players[playerId].p_cash += price;
            // Add to volume indicator
            currentGame.g_shares[stock].s_volume += quantity;
            currentGame.g_shares[stock].s_owned -= quantity;
            currentGame.g_shares[stock].s_volume_v -= quantity;
        }
        else {
            console.log("Unknown type of order", order)
        }
        io.to(gameRoomRoot).emit(gameRoomRoot+"sync", currentGame);
    });


    //Maybe buying and selling should be done server side?

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
