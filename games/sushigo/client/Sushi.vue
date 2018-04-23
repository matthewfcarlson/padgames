<template>
  <div class="game-content">
    <div v-if="!isPhone">
      <div class="panel" v-for="(player, playerIndex) in game.players"  v-bind:key="'player'+playerIndex">
        <h3> {{player}} {{game.playersReady[playerIndex]}} </h3>
        </div>
      <card-view v-for="(playerName,playerID) in game.players" v-bind:key="playerName" v-bind:cards="game.playerRoundDeck[playerID]" v-bind:title="playerName"></card-view>
      {{game.playerScores}}
      <hr/>
      <pre class="hidden-lg">{{game}}</pre>
      <button @click="isPhone = true">Play as a player</button>
    </div>

    <div v-else-if="!isLandscape">
      <h2>Please turn your phone sideways.
    </div>
    
    <div class="container-fluid" v-else-if="isPhone && playerID == -1">
      <h2>Sushi GO!</h2>
      <hr/>
      <h3>Please Input Your Name</h3>
      <input type="text" class="form-control" placeholder="Your name" v-model="playerName" />
      <button @click="JoinGame" class="btn btn-success btn-block">Join Game</button>
      <br/>
      <button @click="ResetGame" class="btn btn-danger">Reset Game</button>    
    </div>
    <div class="container-fluid" v-else-if="isPhone && playerID != -1">
      <div>Player {{playerID}} Round {{game.round}}</div>
      
      
      <div v-if="game.isPlaying == true">
        <div class="row">
          <div class="col-sm" v-for="(player, index) in game.players"  v-bind:key="'player'+index" >
              <i class="fas fa-user" v-if="index == playerID"> </i> {{player}} 
              <span v-if="game.playersReady.length >= index">{{game.playersReady[index]}}</span> 
              <span v-if="game.playerScores.length >= index">{{game.playerScores[index]}}</span>
              <span v-if="game.playerScores.length >= index">{{roundScores[index]}}</span>
          </div>
        </div>
        <card-view @picked-card="PickCard" v-bind:cards="game.playerHands[playerID]" v-bind:cards-set-aside="pickedCard" id="player-hand" title="Hand" class="row"></card-view>
        <div class="row">
          <div class="col-1"><button @click="ReadyToPick" class="btn bnt-success" v-bind:disabled="cardsSetAside.length > 0">Play</button></div>
          <card-view v-bind:cards="game.playerRoundDeck[playerID]" id="player-deck" title="Deck" class="col"></card-view>
        </div>
        
      </div>
      <div v-else-if="game.gameOver">
        <!-- if the game is over -->
      </div>
      <div v-else>
        <!-- if the game hasn't started yet -->
        <p>Waiting for the game to start</p>
        <p>Players waiting:</p>
        <ul>
          <li v-for="player in game.players"> {{player}} </li>
        </ul>
      </div>

      <button v-if="!game.isPlaying && playerID == 0" @click="StartGame" class="btn">StartGame</button>
      <button v-if="!game.isPlaying && playerID == 0" @click="AddAI" class="btn">Add AI</button>
      <!--button @click="ReadyToPick" class="btn" v-bind:disabled="cardsSetAside.length > 0">Play</button-->
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
import CardView from "./cardView";
import VueSocketio from "vue-socket.io";
Vue.use(VueSocketio, window.location.origin);
console.log("Connecting to " + window.location.origin);
export default {
  name: "Sushies",
  components: {
    CardView
  },
  data() {
    return {
      isPhone: window.innerWidth <= 750,
      isLandscape: window.innerWidth >= 450,
      game: new Game(),
      playerID: -1,
      cardsSetAside: false,
      connected: false,
      gameRoom:  "",
      pickedCard: [],
      playerName: "Matt"
    };
  },
  created: function() {
    var self = this;
    $(window).on("resize", function() {
      self.isPhone = window.innerWidth <= 750;
      self.isLandscape = window.innerWidth >= 450;
    });
    if (!self.isPhone) {
      this.JoinGame(null);
    }
    this.gameRoom = this.$route.params.gameID || "";
  },
  computed: {
    isLandscape: function() {
      return window.innerWidth > 450;
    },
    roundScores: function() {
      return this.game.RoundScores();
    }
  },
  methods: {
    ResetGame: function() {
      this.$socket.emit("reset sushi game",this.gameRoom);
    },
    StartGame: function() {
      this.$socket.emit("start sushi game");
    },
    PickCard: function(index) {
      if (this.cardsSetAside){
        console.error("Client can't change their answer");
         return;
      }
      console.log("Client is picking card #" + index);
      var currentPickedIndex = this.pickedCard.indexOf(index);
      if (currentPickedIndex != -1) {
        this.pickedCard.splice(currentPickedIndex, 1);
      } else if (this.game.HasChopsticks(this.playerID)) {
        if (this.pickedCard.length > 1)
          this.pickedCard.splice(0, this.pickedCard.length);
        this.pickedCard.push(index);
      } else {
        if (this.pickedCard.length >= 1)
          this.pickedCard.splice(0, this.pickedCard.length);
        this.pickedCard.push(index);
      }
    },
    AddAI: function() {
      this.$socket.emit("add sushi ai");
    },
    ReadyToPick: function(index) {
      if (this.cardsSetAside){
        console.error("Client can't resend their answer!");
         return;
      }
      if (this.pickedCard.length > 0) {
        this.$socket.emit("pick sushi card", this.pickedCard); //TODO: maybe send the round/turn number so the server doesn't double count
        this.cardsSetAside = true;
      }
    },
    JoinGame: function() {
      this.$socket.emit("join sushi game",  this.gameRoom, this.playerName);
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
    "error message": function(message) {
      alert(message);
    },
    "set sushi player": function(id) {
      this.playerID = id;
      console.log("We are player #" + id);
    },
    "pick sushi card": function(playerID) {
      console.log("Player " + playerID + " is ready!");
      Vue.set(this.game.playersReady, playerID, true);
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

</style>
