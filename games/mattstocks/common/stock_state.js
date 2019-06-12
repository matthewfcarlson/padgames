

function CreateGame() {

    var default_game = { //python style
        g_players: [], //an array of how many players there are
        g_day: 0, //the current date
        g_gameStarted: false, //if the game has been started
        g_defaultCash: 100, // the starting cash for each player
        g_shares: [], // the list of shares in the game,
        Fix() {
            this.g_players = this.g_players.map( (x)=> {
                if (!x.hasOwnProperty("Verify")) return CreatePlayer(x);
                else return x;
            });
        },
        Verify() { //this verifies that the game is in a good state
            // make sure all the players are good
            var good_players = this.g_players.filter((x)=>x.Verify()).length;
            if (good_players != this.g_players.length) return false;
            if (good_players == 0 && this.g_gameStarted) return false;
            return true;
        },
        AddShare(share) {
            // Add share
            this.g_shares.push(share);
        },
        AddPlayer(player) {
            // Add share
            this.g_players.push(player);
        },
    }
    return default_game;
};

function CreatePlayer(data){
    var cash = 0;
    var shares = [];
    var name = "";
    if (data != undefined && typeof data == "object"){
        cash = -1;
        //console.log("Creating new player from ", data);
        if (data.p_cash != undefined) cash = data.p_cash;
        if (data.p_shares != undefined) shares = data.p_shares;
        if (data.p_name != undefined) name = data.p_name;
    }
    else if (data != undefined && typeof data == "string"){
        //console.log("Naming player", data);
        name = data;
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

function CreateShare(name, price){
    var default_share = {
        s_name: name, 
        s_price: price, //the current price or the price it was bought at
        s_day: 0,
        s_index: false,
        s_factor: 1,
        s_history: [], // history of price (not on player shares)
        s_volume: 0, // the count of shares bought or sold (causes prices to flucuate)
        s_volume_v: 0, // the value of shares bought - shares sold (lots of bought shares drives the price up)
        s_owned: 0 // the number of shares owned by parties
    }
    return default_share;
}

module.exports = {
    CreateGame,
    CreatePlayer,
    CreateShare
};