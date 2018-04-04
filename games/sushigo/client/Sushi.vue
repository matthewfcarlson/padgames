<template>
  <div class="game-content">
    <div v-if="!isPhone">
      The whole game board goes here
      {{game.playerScores}}
    </div>
    
    <div class="hello" v-else-if="isPhone && playerID == -1">
      <h2>Please Input Your Name</h2>
      <input type="text" class="form-control" placeholder="Your name" v-model="playerName" />
      <button @click="JoinGame">Join Game</button>
    </div>
    <div class="hello" v-else-if="isPhone && playerID != -1">
      <h1>{{ msg }} Player {{playerID}}</h1>
      
      <pre v-if="game.isPlaying == true">
        <div v-if="game.playerHands != undefined && game.playerHands[playerID] != undefined">
          <ul>
            <li v-for="card,index in game.playerHands[playerID]" v-bind:key="index" @click="PickCard(index)"> 
                {{card.name}} {{card.value}} {{index}}
            </li>
          </ul> 
        </div>
      </pre>

      <button v-if="!game.isPlaying" @click="StartGame">StartGame</button>
      <button @click="PickCard(0)">PlayAll</button>
      <button @click="ResetGame">Reset Game</button>    
      <pre>{{game}}</pre>
      
    </div>
    <div v-else>
      Unknown state
    </div>
  </div>
</template>

<script>
import { Game } from "../common/game";
import Vue from "vue";
import VueSocketio from "vue-socket.io";
Vue.use(VueSocketio, window.location.origin);
console.log("Connecting to " + window.location.origin);
export default {
  name: "Sushies",
  data() {
    return {
      isPhone: window.innerWidth <= 667,
      msg: "Sushi on the go",
      game: new Game(),
      playerID: -1,
      connected: false,
      playerName: ""
    };
  },
  methods: {
    ResetGame: function() {
      this.$socket.emit("reset sushi game");
    },
    StartGame: function() {
      this.$socket.emit("start sushi game");
    },
    PickCard: function(index) {
      console.log("Client is picking card #" + index);
      this.$socket.emit("pick sushi card", index);
    },
    JoinGame: function() {
      this.$socket.emit("join sushi game", this.playerName);
    }
  },

  sockets: {
    connect: function() {
      console.log("socket connected");
      this.connected = true;
    },
    "set players": function(newPlayer) {
      this.$set(this.game, "players", newPlayer);
    },
    "start game": function() {
      this.game.StartGame();
    },
    "reset game": function() {
      this.game = new Game(); //might need a vue.set here
      this.playerID = -1;
    },
    "set deck seed": function(seed) {
      this.game.deckSeed = seed;
    },
    "set sushi player": function(id) {
      this.playerID = id;
      console.log("We are player #" + id);
    },
    "pick sushi card": function(playerID, cardID) {
      this.game.SetAsideCard(playerID, cardID);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1,
h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
