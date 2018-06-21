<template>
<div class="content">
   <div class="container-fluid" v-if="playerID == -1">
      <h2>Game of Stuff!</h2>
      <hr/>
      <h3>Players</h3>
      <div v-for="player in players">{{player}}</div>
      <hr/>
      <h3>Please Input Your Name</h3>
      <input type="text" class="form-control" placeholder="Your name" v-model="playerName" />
      <button @click="JoinGame()" class="btn btn-success btn-block">Join Game</button>
      <br/>
      <button @click="LeaveGame" class="btn btn-danger">Leave Game</button>    
    </div>
    <div class="container-fluid" v-else>      
      <h1>Stuff {{question}}</h1>
      <input type="text" class="form-control" placeholder="Your answer" v-model="answer" />
      <button @click="Answer()" class="btn btn-success btn-block">Answer</button>
    </div>
</div>
</template>
<script>
import Vue from "vue";
import VueSocketio from "vue-socket.io";
import Questions from "../common/questions.js";

Vue.use(VueSocketio, window.location.origin);
const ROOT = "stuff:";
export default {
  name: "Stuff",
  data() {
    return {
      gameRoom: "",
      connected: false,
      answer: "",
      question: "",
      pickedCard: [],
      playerID: -1,
      gameName: "",
      players: [],
      game: null,
      playerName: "Testing"
    };
  },
  methods: {
    StartGame: function() {
      this.$socket.emit(ROOT + "start game");
    },
    JoinGame: function(gameRoom, playerName) {
      if (gameRoom == undefined) gameRoom = this.gameRoom;
      if (playerName == undefined) playerName = this.playerName;
      this.$socket.emit(ROOT + "join game", gameRoom, playerName);
    },
    LeaveGame: function() {
      this.$router.push("/stuff");
    }
  },
  created: function() {
    this.gameRoom = this.$route.params.gameID || "";
  },
  sockets: {
    connect: function() {
      console.log("socket connected for room " + this.gameRoom);
      this.connected = true;
      this.$socket.emit(ROOT + "sync game", this.gameRoom);
    },
    "stuff:error": function(message) {
      alert(message);
    },
    "stuff:sync game": function(newgame) {
      console.log("New Game:", newgame);
      //TODO do this better
      this.players = newgame.players;
      this.question = Questions.questions[newgame.questions[0]];
    },
    "stuff:set player": function(playerIndex) {
      console.log("Player ID" + playerIndex);
      //TODO do this better
      this.playerID = playerIndex;
    }
  }
};
</script>

<style scoped>
</style>