<template>
<div class="content">
   <div class="container-fluid" v-if="playerID == -1">
      <h2>Game of Stuff!</h2>
      <hr/>
      <h3>Players</h3>
      <div v-for="player in players"  v-bind:key="player">{{player}}</div>
      <hr/>
      <h3>Please Input Your Name</h3>
      <input type="text" class="form-control" placeholder="Your name" v-model="playerName" />
      <button @click="JoinGame()" class="btn btn-success btn-block">Join Game</button>
      <br/>
      <button @click="LeaveGame" class="btn btn-danger">Leave Game</button>    
    </div>
    <div class="container-fluid" v-else-if="state == 'waiting'">
        Loading...
    </div>
    <div class="container-fluid" v-else-if="state == 'question'">      
      <h2>Stuff {{question}}</h2>
      <div v-if="!AnswerSubmitted">
        <input type="text" class="form-control" placeholder="Your answer" v-model="answer" />
        <button @click="Answer()" class="btn btn-success btn-block">Answer</button>
      </div>
      <div v-else>
        Waiting for everyone else to answer
      </div>
      <div v-for="player,index in players" v-bind:key="player+index">
        {{player}} 
      </div>
      {{playerAnswers}}
      {{scores}}
    </div>
    <div class="container-fluid" v-else-if="state == 'guessing'">
        <h2>Stuff {{question}}</h2>
        <h2>Your answer: {{answer}}</h2>
        <div v-if="playerAnswers[PlayerIndex]!=''">
          
          Who guessed you?
          <button class="btn-block btn" @click="Guessed(index)" v-for="player,index in players" v-bind:key="player+index" v-if="index != PlayerIndex">{{player}}</button>
          {{playerAnswers}}
        </div>
        <div v-else>You've been guessed!</div>
    </div>
</div>
</template>
<script>
//<div v-if="playerAnswers[index] != undefined && playerAnswers[index].length == 0">???</div>
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
      playerID: -1,
      gameName: "",
      state: "waiting",
      players: [],
      scores: [],
      playerAnswers: [""],
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
    },
    Answer: function(gameRoom, answer) {
      if (gameRoom == undefined) gameRoom = this.gameRoom;
      if (answer == undefined) answer = this.answer;
      this.$socket.emit(ROOT + "answer", gameRoom, answer);
    },
    Guessed: function(playerIndex, gameRoom) {
      if (gameRoom == undefined) gameRoom = this.gameRoom;
      this.$socket.emit(ROOT + "guessed", gameRoom, playerIndex);
    }
  },
  computed: {
    PlayerIndex: function() {
      if (this.playerID < 1) return 0;
      return this.playerID - 1;
    },
    AnswerSubmitted: function() {
      if (this.playerID < 1) return false;
      if (this.playerAnswers == undefined || this.playerAnswers.length == 0)
        return false;
      console.log(this.playerAnswers[this.PlayerIndex]);
      return this.playerAnswers[this.PlayerIndex].length > 0;
    }
  },
  created: function() {
    this.gameRoom = this.$route.params.gameID || "";
  },
  sockets: {
    connect: function() {
      console.log("socket connected for room " + this.gameRoom);
      this.connected = true;
      this.$socket.emit(ROOT + "connect");
      this.$socket.emit(ROOT + "sync game", this.gameRoom);
    },
    "stuff:error": function(message, leave) {
      alert(message + leave);
      if (leave != undefined && leave == true) {
        console.log("Leaving game");
        LeaveGame();
      }
    },
    "stuff:sync game": function(newgame) {
      console.log("New Game:", newgame);
      if (newgame == undefined) {
        console.error("Bad new game");
        return;
      }
      //TODO do this better
      this.players = newgame.players;
      this.scores = newgame.scores;
      this.question = Questions.questions[newgame.questions[0]];
      if (newgame.playerAnswers != undefined)
        this.playerAnswers = newgame.playerAnswers;
      this.state = newgame.state;
      console.log(this.playerAnswers);
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