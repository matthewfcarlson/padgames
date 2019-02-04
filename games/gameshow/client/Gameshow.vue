<template>
  <div class="content">
    <br>
    <div class="container">
      <div class="jumbotron">
        <h1 class="display-4 text-black">Do you know your bishop?</h1>
      </div>
    </div>
    <div v-if="adminMode">
      <h2>Admin Mode</h2>
      <p>Correct Answer: {{question.person}}</p>
      <button class="btn btn-block btn-success" @click="gameCorrect">Correct!</button>
      <button class="btn btn-block btn-danger" @click="gameIncorrect">Incorrect!</button>
      <br>
      <div is="TeamList" v-bind:teams="teams" @click="gameSuperBuzz"></div>
      <br>
      <div class="input-group mb-3">
        <input type="text" class="form-control" v-model="newTeamName" placeholder="New Team Name">
        <div class="input-group-append">
          <button class="btn btn-primary" @click="gameAddTeam">Add Team</button>
        </div>
      </div>
      <br>
      <button class="btn btn-block btn-warning btn-sm">Reset Game</button>
    </div>
    <div v-else-if="gameOver">
        <h2>Game Over!</h2>
        <h3>The winner is: </h3>
    </div>
    <div v-else-if="isPad">
        <div v-if="question.id >= 0">
            <h3>When asked, "{{GameData.questions[question.id]}}?"<h3>
            <h3>They said "{{GameData.answers[question.person][question.id]}}"</h3>
        </div>
        Questions will appear here.
        <div v-if="currentTeamsTurn != ''">Currently it is {{currentTeamsTurn}}s team and they have 0:05</div>
        </div>
    <div v-else-if="playerTeam == ''">
      <div is="TeamList" v-bind:teams="teams" @click="gamePickTeam"></div>
    </div>
    <div v-else><h3>Team {{ playerTeam }}</h3><p>Press to buzz in!</p>
    <button class="btn btn-block btn-huuge btn-success" @click="gameBuzz">Buzz in!</div>
  </div>
  <br/>
  <hr>
  <small class="text-center">Made by Matthew Carlson</small>
</template>

<script>
import Vue from "vue";
import VueSocketio from "vue-socket.io";
import Konami from "./konami";
import TeamList from "./TeamList";
import GameData from "../common/data";

Vue.use(VueSocketio, window.location.origin);

const ROOT = "Gameshow:";

export default {
  name: "Gameshow game",
  components: {
    TeamList
  },
  data() {
    var self = this;

    var gameRoom = this.$route.params.gameID || "";
    var debug =
      location.hostname === "localhost" || location.hostname === "127.0.0.1";

    return {
      windowLocation: window.location.href,
      playerTeam: "",
      debug: debug,
      teams: [],
      question: {
        id: -1,
        answer: -1,
        person: "",
      },
      adminMode: false,
      currentTeamsTurn: "",
      isPad: window.innerWidth >= 750,
      newTeamName: "",
      konami: null
    };
  },
  computed: {
      gameOver: function(){
          if (this.question.id == -2) return true;
          return false;
      }
  },
  methods: {
    konamiActivated: function() {
      console.log("Konami activated!");
      this.adminMode = true;
    },
    gameReset: function() {
      this.$socket.emit(ROOT + "reset");
    },
    gameBuzz: function(){
        this.$socket.emit(ROOT+"buzz",this.playerTeam);
    },
    gameSuperBuzz: function(teamName){
        this.$socket.emit(ROOT+"super buzz",teamName);
    },
    gameAddTeam: function() {
      var teamName = this.newTeamName;
      this.$socket.emit(ROOT + "add team", teamName);
    },
    gameCorrect: function() {
      var questionId = this.question["id"];
      this.$socket.emit(ROOT + "correct", questionId);
    },
    gameIncorrect: function() {
      var questionId = this.question["id"];
      this.$socket.emit(ROOT + "incorrect", questionId);
    },
    gameRemoveTeam: function(teamName) {
      console.log("Removing team", teamName);
      this.$socket.emit(ROOT + "remove team", teamName);
    },
    gamePickTeam: function(teamName) {
      console.log("Pciking team", teamName);
      this.$socket.emit(ROOT + "pick team", teamName);
      this.playerTeam = teamName;
    },
    gameReset: function() {
      this.$socket.emit(ROOT + "reset");
    }
  },
  sockets: {
    connect: function() {
      this.$socket.emit(ROOT + "connect");
    },
    "Gameshow:teams": function(teams) {
      console.log("Recieved new teams", teams);
      while (this.teams.length > 0) this.teams.shift();
      while (teams.length > 0) this.teams.push(teams.shift());
    },
    "Gameshow:question": function(question) {
      console.log("Recieved new question", question);
      this.question.id = question.id;
      this.question.person = question.person;
      this.question.answer = question.answer;
    },
    "Gameshow:team turn": function(teamTurn){
        this.currentTeamsTurn = teamTurn;
    }
  },
  mounted: function() {
    this.$socket.emit(ROOT + "connect");
    // add keydown event listener
    this.konami = new Konami(this.konamiActivated);
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
.btn-huuge{
    padding: 2.5rem 2rem;
    font-size: 2.25rem;
    line-height:3rem;
}
</style>