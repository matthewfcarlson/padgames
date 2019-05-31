

function CreateGame() {

    var default_game = { //python style
        g_players: [], //an array of how many players there are
        g_day: 0, //the current date
        g_gameStarted: false, //if the game has been started
        g_defaultCash: 100, // the starting cash for each player
        g_shares: [] // the list of shares in the game
    }
    return default_game;
};

function CreatePlayer(name){
    var default_player = {
        p_name: name,
        p_cash: 0,
        p_shares: []
    }
    return default_player;
}

function CreateShare(name, price, ){
    var default_share = {
        s_name: name, 
        s_price: price, //the current price or the price it was bought at
        s_day:0
    }
    return default_share;
}

module.exports = {
    CreateGame,
    CreatePlayer,
    CreateShare
};