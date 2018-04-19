<template>
  <div class="game-content">
    <div v-if="!isPhone">
      <div class="panel" v-for="(player, playerIndex) in game.players"  v-bind:key="'player'+playerIndex">
        <h3> {{player}} {{game.playersReady[playerIndex]}} </h3>
        <div class="row" v-if="game.playerRoundDeck[playerIndex] != undefined">
          <div class="card sushi-card col-sm" v-for="(card,index) in game.playerRoundDeck[playerIndex]" v-bind:key="'cardr'+index">
              <!--img class="card-img-top" alt="Card image cap"-->
            <div class="card-body">
              <p class="card-text"> {{card.name}} {{card.value}}</p>
            </div>
          </div>
        </div>
      </div>        
      The whole game board goes here
      <card-view v-for="(playerName,playerID) in game.players" v-bind:key="playerName" v-bind:cards="game.playerRoundDeck[playerID]" v-bind:title="playerName"></card-view>
      {{game.playerScores}}
      <hr/>
      <pre class="hidden-sm">{{game}}</pre>
      <button @click="isPhone = true">Play as a player</button>
    </div>

    <div v-else-if="!isLandscape">
      <h2>Please turn your phone sideways.
    </div>
    
    <div class="container-fluid" v-else-if="isPhone && playerID == -1">
      <h2>Please Input Your Name</h2>
      <input type="text" class="form-control" placeholder="Your name" v-model="playerName" />
      <button @click="JoinGame" class="btn btn-success btn-block">Join Game</button>
    </div>
    <div class="container-fluid" v-else-if="isPhone && playerID != -1">
      <h2>Player {{playerID}} Round {{game.round}}</h2>
      
      
      <div v-if="game.isPlaying == true">
        <div class="row">
          <div class="col-sm" v-for="(player, index) in game.players"  v-bind:key="'player'+index" >
              <i class="fas fa-user" v-if="index == playerID"> </i> {{player}} 
              <span v-if="game.playersReady.length >= index">{{game.playersReady[index]}}</span> 
              <span v-if="game.playerScores.length >= index">{{game.playerScores[index]}}</span>
              <span v-if="game.playerScores.length >= index">{{roundScores[index]}}</span>
          </div>
        </div>
        <card-view @picked-card="PickCard" v-bind:cards="game.playerHands[playerID]" v-bind:cards-set-aside="pickedCard" id="player-hand" title="Hand"></card-view>
        <card-view v-bind:cards="game.playerRoundDeck[playerID]" id="player-deck" title="Deck"></card-view>
        
      </div>
      {{pickedCard}} {{cardsSetAside}}

      <button v-if="!game.isPlaying && playerID == 0" @click="StartGame" class="btn">StartGame</button>
      <button v-if="!game.isPlaying && playerID == 0" @click="AddAI" class="btn">Add AI</button>
      <button @click="ReadyToPick" class="btn" v-bind:disabled="cardsSetAside.length > 0">Play</button>      
      <pre>{{isLandscape}}</pre>
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
      pickedCard: [],
      playerName: ""
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
        if (this.pickedCard.length > 1)
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
