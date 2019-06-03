<template>
  <div class="content">
    <h1>Matt Stocks</h1>
    <div v-if="!g_gameStarted">
      <div class="card">
        Game hasn't started yet
        <pre>
          {{_data}}
        </pre>
        <input v-model="playerName" type="text" placeholder="Player Name"/>
      </div>
      <button @click="GameStart">Start Game</button>
      <button @click="AddNewPlayer">Add Player</button>
    </div>
    <div v-else-if="bigScreen">
      <h2>Game has started</h2>
      <pre class="card">
        {{_data}}
      </pre>
    </div>
    <div v-else>
      <h2>Game is going on</h2>
      <pre class="card">
        {{_data}}
      </pre>
      <div v-for="(stock, id) in g_shares" v-bind:key="'s'+id">
        <button @click="currentStock = id">Stock {{ stock.s_name }}</button>
      </div>
      <div v-for="(player, id) in g_players" v-bind:key="'p'+id">
        <button @click="playerId = id">Player {{ player.p_name }}</button>
      </div>
      <div>
      <input v-model="numberShares" placeholder="Numer of shares to buy" type="number"/>
      
      <button @click="BuyShare(currentStock,numberShares)">Buy</button>
      <button @click="SellShare(currentStock,numberShares)">Sell</button>
      </div>
      <button @click="Advance">Advance Day</button>
    </div>
    
    <button @click="GameReset">Reset Game</button>
      <div class="text-center">
      <small>Made by Matthew Carlson</small>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import VueSocketio from "vue-socket.io";
import StockGame from "../common/stock_state";

Vue.use(VueSocketio, window.location.origin);

const ROOT = "Stocks:";

export default {
  name: "Stocks",
  /*components: {
    TeamList,
    QuestionView,
    Scores
  },*/
  data() {
    var self = this;

    var gameRoom = this.$route.params.gameID || "";
    var debug =
      location.hostname === "localhost" || location.hostname === "127.0.0.1";

    var defaults = {
      windowLocation: window.location.href,
      debug: debug,
      playerId:-1,
      syncing: false,
      playerName: "",
      currentStock: -1,
      numberShares: 0,
    };
    return Object.assign({}, defaults, StockGame.CreateGame());
  },
  computed: {
     bigScreen: function() {
      var value = window.screen.width;
      console.log("Screen width: "+value);
      if (value > 1250) return true;
      return false;
    },
  },
  methods: {
    GameReset: function() {
      this.$socket.emit(ROOT + "reset");
    },
    GameStart: function() {
      if (!this.g_gameStarted) {
        this.g_gameStarted = true;
        //give each player default cash
      }
    },
    Advance: function() { //advance the day
      this.$socket.emit(ROOT + "advance");
    },
    BuyShare: function(stock_index, quantity) {
      console.log("Trying to buy "+quantity+" of "+ stock_index);
      if (stock_index >= this.g_shares.length) return;
      if (quantity < 1) return;
      var cost = this.g_shares[stock_index]["s_price"] * quantity;
      if (this.g_players[this.playerId].p_cash < cost){
        console.log("This costs too much");
        return;
      }
      this.g_players[this.playerId].p_cash -= cost;
      //make sure the player can afford it
      console.log("Cost" + cost);
    },
    SellShare: function(stock_index, quantity){
      console.log("Trying to sell "+quantity+" of "+ stock_index+ " for "+this.playerId);
      if (stock_index >= this.g_shares.length) return;
      if (quantity < 1) return;
      //check to make sure we have enough
      var price = this.g_shares[stock_index]["s_price"] * quantity;
      console.log("Revenue" + price);
      //calculate the profit (taxes?)
      //remove the stocks we have
      //add the cash to the player price
      this.g_players[this.playerId].p_cash += price;

    },
    AddNewPlayer: function() {
      var name = this.playerName;
      this.playerName = "";
      //TODO read from text box
      var player = StockGame.CreatePlayer(name);
      this.AddPlayer(player);
    },
    BuyShare: function(){
      //get the current price of the share you want to buy
    },
    GameChanged: function(prop, val, oldVal) {
      if (this.syncing) return;
      if (!this.Verify()){
        console.error("We have a poorly formed game object");
        //TODO refresh and resync from the server
        this.$socket.emit(ROOT + "connect");
        return;
      }
      console.log("Notify the server that we've updated oursevles", prop, val, oldVal);
      this.$socket.emit(ROOT + "modify", {name:prop, current:val});
    }
  },
  sockets: {
    connect: function() {
      this.$socket.emit(ROOT + "connect");
    },
    "Stocks:sync": function(newGame) {
      console.log("Server sent us new version: "+newGame);
      this.syncing = true;
      for (var prop in newGame){
        this[prop] = newGame[prop];
      }
      this.Fix();
      var self = this;
      Vue.nextTick( () => self.syncing = false);
    },
    /* //This isn't needed because 
    "Stocks:set player": function(playerIndex) {
      console.log("Player ID" + playerIndex);
      //TODO do this better
      this.playerIndex = playerIndex;
      if (!this.debug) {
        console.log("Storing the game for later");

        localStorage.setItem(
          ROOT,
          JSON.stringify({
            playerName: this.playerName,
            index: playerIndex,
            socketId: this.$socket.id
          })
        );
      }
    }*/
  },
  mounted: function() {
    this.$socket.emit(ROOT + "connect");
    //console.log(this);
    for (const prop in this._data){
      if (prop.startsWith("g_")) { //if it's a game property
        //console.log(prop);
        this.$watch(prop, (o,n)=> {var c=prop; this.GameChanged(c,o,n)}, {deep:true});
      }
    }
  }
};
</script>
<style scoped>
.content {
  min-height: 100vh;
  /* Permalink - use to edit and share this gradient: http://colorzilla.com/gradient-editor/#f19b4d+0,ea8b31+100 */
  background: #262276;
  color: #fbe6cb;
}
.jumbotron h1,
.text-black {
  color: #333;
}
.btn-huuge {
  padding: 2.5rem 2rem;
  font-size: 2.25rem;
  line-height: 3rem;
}
</style>