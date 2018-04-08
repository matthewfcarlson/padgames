<template>
  <div class="game-content">
    <div v-if="!isPhone">
      {{game.players}}
      The whole game board goes here
      {{game.playerScores}}
      <hr/>
      <pre>{{game}}</pre>
      <button @click="isPhone = true">Play as a player</button>
    </div>
    
    <div class="container-fluid" v-else-if="isPhone && playerID == -1">
      <h2>Please Input Your Name</h2>
      <input type="text" class="form-control" placeholder="Your name" v-model="playerName" />
      <button @click="JoinGame" class="btn btn-success">Join Game</button>
    </div>
    <div class="container-fluid" v-else-if="isPhone && playerID != -1">
      <h1>{{ msg }} Player {{playerID}}</h1>
      
      
      <div v-if="game.isPlaying == true">
        <div class="nav">
          <span v-for="player, index in game.players">
              <i class="fas fa-user" v-if="index == playerID"> </i> {{player}} {{game.playersReady[index]}} 
          </span>  
        </div>
        <div v-if="game.playerHands != undefined && game.playerHands[playerID] != undefined" class="row">
          
          <div class="card sushi-card col-sm" v-for="card,index in game.playerHands[playerID]" v-bind:key="index" @click="PickCard(index)">
            <!--img class="card-img-top" alt="Card image cap"-->
            <div class="card-body">
              <p class="card-text"> {{card.name}} {{card.value}}</p>
            </div>
          </div>
        </div>
        <div v-if="game.playerHands != undefined && game.playerRoundDeck[playerID] != undefined" class="row">
          
          <div class="card sushi-card col-sm" v-for="card,index in game.playerRoundDeck[playerID]" v-bind:key="index">
            <!--img class="card-img-top" alt="Card image cap"-->
            <div class="card-body">
              <p class="card-text"> {{card.name}} {{card.value}}</p>
            </div>
          </div>
        </div>
      </div>
      {{pickedCard}} {{cardsSetAside}}

      <button v-if="!game.isPlaying && playerID == 0" @click="StartGame">StartGame</button>
      <button v-if="!game.isPlaying && playerID == 0" @click="AddAI">Add AI</button>
      <button @click="ReadyToPick">Play</button>      
      <pre>{{game}}</pre>
      <button @click="ResetGame" class="btn btn-danger">Reset Game</button>    
      
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
      cardsSetAside: false,
      connected: false,
      pickedCard: [],
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
      var currentPickedIndex = this.pickedCard.indexOf(index);
      if (currentPickedIndex != -1) {
        this.pickedCard.splice(currentPickedIndex, 1);
      } else if (this.game.HasChopsticks(this.playerID)) {
        console.error("I'm not sure what to do in this case");
        if (this.pickedCard.length >= 1)
          this.pickedCard.splice(0, this.pickedCard.length);
        this.pickedCard.push(index);
      } else {
        if (this.pickedCard.length >= 1)
          this.pickedCard.splice(0, this.pickedCard.length);
        this.pickedCard.push(index);
      }
    },
    AddAI: function() {},
    ReadyToPick: function(index) {
      if (this.pickedCard.length > 0) {
        this.$socket.emit("pick sushi card", this.pickedCard);

        this.cardsSetAside = true;
      }
    },
    JoinGame: function() {
      this.$socket.emit("join sushi game", this.playerName);
    }
  },

  sockets: {
    connect: function() {
      console.log("socket connected");
      this.connected = true;
      if (!this.isPhone) this.$socket.emit("sync sushi game");
    },
    "sync sushi game": function(newGame) {
      console.log("We got a new state for the sushi game", newGame);
      this.game.SyncGame(newGame);
      this.$set(this.game, "playerHands", newGame.playerHands);
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
    "pick sushi card": function(playerID) {
      console.log("Player " + playerID + " is ready!");
      this.game.playersReady[playerID] = true;
    },
    "pick sushi cards": function(cardIDs) {
      console.log("All players have played!", cardIDs);
      this.cardsSetAside = false;
      this.pickedCard.splice(0, this.pickedCard.length);
      var self = this;
      //set everyone to not ready
      this.game.playersReady = self.game.playersReady.map(x => false);
      cardIDs.forEach((element, index) => {
        console.log("Setting aside cards for player " + index, element);
        self.game.SetAsideCard(index, element);
      });
      //this.game.SetAsideCard(playerID, cardID);
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
.sushi-card {
  font-size: 11pt;
  padding-left: 0;
  padding-right: 0;
}
.sushi-card .card-body {
  padding: 0.25rem;
  text-align: center;
}
</style>
