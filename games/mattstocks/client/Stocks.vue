<template>
  <div class="content">
    <h1>Matt Stocks</h1>
    <div v-if="!g_gameStarted">
      <div>
        <h3>Game hasn't started yet</h3>
        <p>Add the players you want in the game</p>
        <ul>
          <li v-for="player in g_players">{{player.p_name}}</li>
        </ul>
        <div class="input-group">
          <input v-model.trim="playerName" class="form-control" type="text" placeholder="Player Name"/>
          <div class="input-group-append">
            <button class="btn btn-block btn-primary" @click="AddNewPlayer">Add Player</button>
          </div>
        </div>
      </div>
      <br/>
      <button class="btn btn-success btn-block" @click="GameStart">Start Game</button>
      <hr/>
      Starting Cash: <input v-model.number="g_defaultCash" type="number" placeholder="Starting cash"/>
    </div>
    <div v-else-if="bigScreen">
      <h2>Day: {{g_day}}</h2>
      <div class="container-fluid">
        <div class="row">
          <div class="col" v-for="share in g_shares">
            <div class="card text-white bg-primary">
              <div class="card-body">
                <div class="card-title">{{share.s_name}}</div>
                <p class="card-text text-center">${{share.s_price}}</p>
                <!-- TODO add difference and maybe graph -->
              </div>
            </div>
          </div>
        </div>
        <br/>
        <div class="row">
          <div class="col" v-for="player in g_players">
            <div class="card text-white bg-primary">
              <div class="card-header">{{player.p_name}}</div>
              <ul class="list-group list-group-flush text-black">
                <li class="list-group-item">Cash: ${{player.p_cash}}</li>
                <li class="list-group-item" v-for="stock in AggregateShares(player.p_shares)"> {{stock.s_name}} Avg:${{stock.s_price}} #{{stock.s_count}}</li>
                <li class="list-group-item"> Unrealized Profit: ${{UnrealizedProfit(player.p_shares)}} </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <hr/>
      <pre class="card">
        {{_data}}
      </pre>
    </div>
    <div v-else>
      <h2>Day: {{g_day}}</h2>
      <div class="btn-group btn-group-toggle btn-group-justified" role="group" data-toggle="buttons" aria-label="Basic example">
        <label class="btn btn-secondary" v-for="(stock, id) in g_shares" :for="'stock'+id" @click="currentStock = id">
          <input type="radio" name="stocks" :id="'stock'+id" :value="id" >Stock {{ stock.s_name }}</input>
        </label>
      </div>
      <br/>
      <div class="btn-group btn-group-toggle btn-group-justified" role="group" data-toggle="buttons" aria-label="Basic example">
        <label class="btn btn-secondary" v-for="(player, id) in g_players" :for="'player'+id" @click="playerId = id">
          <input type="radio" name="player" :id="'player'+id" :value="id" >{{ player.p_name }}: ${{ player.p_cash }}</input>
        </label>
      </div>
      <div v-if="maxShares >= 0">Number of shares you can buy: {{ maxShares }}</div>
      <div v-if="sellableShares >= 0">Number of shares you can sell: {{ sellableShares }}</div>
      <div>
        <numkeyboard v-model.number="numberShares" ok-text="OK" text-align="left" v-bind:point="false" placeholder="Number of Shares"></numkeyboard>
        <div class="btn-group btn-group-justified" role="group">
          <button class="btn btn-success" @click="BuyShare(currentStock,numberShares)">Buy</button>
          <button class="btn btn-warning" @click="SellShare(currentStock,numberShares)">Sell</button>
        </div>
      </div>
      
      <button class="btn btn-primary btn-block" @click="Advance">Advance Day</button>
      <hr/>
      <button class="btn btn-danger btn-block" @click="GameReset">Reset Game</button>
      
    </div>
    <div class="text-center">
      <small>Made by Matthew Carlson</small>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import VueSocketio from "vue-socket.io";
import StockGame from "../common/stock_state";
import numkeyboard from './NumPad';
//import 'vue-numkeyboard/style.css';


//TODO
// Add calculate type component that can take in the number and type of stock
// Add bar to select different stock types
// Fix Buy/Sell Bar
// Add balance/profit sheets

Vue.use(VueSocketio, window.location.origin);

const ROOT = "Stocks:";

export default {
  name: "Stocks",
  components: {
    numkeyboard
  },
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
      var value = window.innerWidth;
      console.log("Screen width: "+value);
      if (value > 1250) return true;
      return false;
    },
    maxShares: function(){
      if (this.playerId < 0) return -1;
      if (this.currentStock < 0) return -1;
      var price = this.g_shares[this.currentStock].s_price; // get the price
      var cash = this.g_players[this.playerId].p_cash; // get the cash
      return Math.floor(cash / price);
    },
    sellableShares: function(){
      console.log(this.playerId, this.currentStock);
      if (this.playerId < 0) return -1;
      if (this.currentStock < 0) return -1;
      var stock_symbol = this.g_shares[this.currentStock].s_name;
      var stock_count = this.g_players[this.playerId].p_shares.filter((x)=>{
          return x.s_name == stock_symbol;
      }).length;
      return stock_count;
    }
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
    AggregateShares: function(shares){
      var aggregated = {};
      // shares must have s_price, s_name, and s_count
      
      for (var share_index in shares){
        var share = shares[share_index];
        var share_id = share.s_id;
        if (aggregated[share_id] == undefined) aggregated[share_id] = { "s_count":0, "s_price":0, "s_total":0, "s_name": share.s_name};
        aggregated[share_id].s_count+=1;
        aggregated[share_id].s_total += share.s_price;
      }
      //console.log(aggregated);
      var results = [];
      for (var share_id in aggregated){
        var share = aggregated[share_id];
        share.s_price = share.s_total / share.s_count;
        results.push(share);
      }
      //
      return results;
    },
    UnrealizedProfit: function(shares){
      var profit = 0;
      for (var share_index in shares){
        var share = shares[share_index];
        var share_id = share.s_id;
        var sell_price = this.g_shares[share_id].s_price;
        var buy_price = share.s_price;
        profit += (sell_price - buy_price);
      }
      //go through the shares and get the price of the current share - the price we bought it for
      return profit;
    },
    BuyShare: function(stock_index, quantity) {
      var order = {
        "type":"BUY",
        "count": quantity,
        "stock": stock_index,
        "player": this.playerId
      }
      this.$socket.emit(ROOT + "order", order);
      this.numberShares = 0;
    },
    SellShare: function(stock_index, quantity){
      var order = {
        "type":"SELL",
        "count": quantity,
        "stock": stock_index,
        "player": this.playerId
      }
      this.$socket.emit(ROOT + "order", order);
      this.numberShares = 0;
    },
    AddNewPlayer: function() {
      var name = this.playerName;
      this.playerName = "";
      //TODO read from text box
      var player = StockGame.CreatePlayer(name);
      this.AddPlayer(player);
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
//@import 'vue-numkeyboard/style.css';
</script>
<style scoped>
@import './keyboard.css';
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
.btn-group-justified {
  display: flex;
}
.btn-group-justified .btn {
  flex-grow: 1;
}

</style>