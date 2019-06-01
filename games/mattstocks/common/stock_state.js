

function CreateGame() {

    var default_game = { //python style
        g_players: [], //an array of how many players there are
        g_day: 0, //the current date
        g_gameStarted: false, //if the game has been started
        g_defaultCash: 100, // the starting cash for each player
        g_shares: [], // the list of shares in the game,
        Verify() { //this verifies that the game is in a good state
            // make sure all the players are good
            this.g_players.map( (x)=> {
                if (x.Verify == undefined) return CreatePlayer(x);
                else return x;
            });
            var good_players = this.g_players.filter((x)=>x.Verify()).length;
            if (good_players != this.g_players.length) return false;
            if (good_players == 0 && g_gameStarted) return false;
            return true;
        }
    }
    return default_game;
};

function CreatePlayer(name){
    var cash = 0;
    var shares = [];
    if (typeof name == Object){
        cash = -1;
        if (name.cash == undefined) cash = name.cash;
        
    }
    var default_player = {
        p_name: name,
        p_cash: cash,
        p_shares: shares,
        Verify() { //verifies that a player is in good shape
            if (this.p_cash < 0) return false;
            if (this.p_name == null || this.p_name.length == 0) return false;
            return true;
        }
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