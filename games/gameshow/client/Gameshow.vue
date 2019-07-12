<template>
  <div class="content">
    <br>
    <div class="container">
      <div class="jumbotron">
        <h1 class="display-4 text-black">Do you know your bishopric?</h1>
      </div>
    </div>
    <div v-if="adminMode">
      <h2>Admin Mode</h2>
      <p>Correct Answer: {{question.person}}</p>
      <p>Current Team: {{currentTeamsTurn}}</p>
      <button class="btn btn-block btn-success btn-lg" @click="gameCorrect">Correct!</button>
      <button class="btn btn-block btn-danger btn-lg" @click="gameIncorrect">Incorrect!</button>
      <button class="btn btn-block btn-info btn-lg" @click="gameSkipQuestion">Skip</button>
      <br>
      <div is="TeamList" v-bind:teams="teams" @click="gameSuperBuzz"></div>
      <button class="btn btn-block btn-info" @click="gameSuperBuzz('')">Reset Buzzer</button>
      <br>
      <div class="input-group mb-3">
        <input type="text" class="form-control" v-model="newTeamName" placeholder="New Team Name">
        <div class="input-group-append">
          <button class="btn btn-primary" @click="gameAddTeam">Add Team</button>
        </div>
      </div>
      <br>
      <button class="btn btn-block btn-warning btn-sm" @click="gameReset">Reset Game</button>
    </div>
    <div v-else-if="gameOver">
      <h1>Game Over!</h1>
      <h1>The winner is: {{winningTeam}}</h1>
    </div>
    <div v-else-if="isPad" class="text-center">
      <div
        is="QuestionView"
        v-bind:question="question"
        @click="gameTimesUp"
        :currentTeamsTurn="currentTeamsTurn"
      ></div>
      <div is="Scores" v-bind:teams="teams"></div>
    </div>
    <div v-else-if="playerTeam == ''">
      <h3>Click to join a team</h3>
      <div is="TeamList" v-bind:teams="teams" @click="gamePickTeam"></div>
    </div>
    <div v-else>
      <h3>Team {{ playerTeam }}</h3>
      <button
        v-if="currentTeamsTurn == ''"
        class="btn btn-block btn-huuge btn-success"
        @click="gameBuzz"
      >Buzz in!</button>
      <h3 v-else-if="currentTeamsTurn==playerTeam" class="text-center">It is your turn!</h3>
      <h3 v-else class="text-center">Not your turn :(</h3>
      <div is="Scores" v-bind:teams="teams"></div>
    </div>
    <br>
    <hr>
    <div class="text-center">
      <small>Made by Matthew Carlson</small>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import VueSocketio from "vue-socket.io";
import Konami from "./konami";
import TeamList from "./TeamList";
import QuestionView from "./QuestionView";
import Scores from "./Scores";

Vue.use(VueSocketio, window.location.origin);

const ROOT = "Gameshow:";

export default {
  name: "Gameshow",
  components: {
    TeamList,
    QuestionView,
    Scores
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
        person: ""
      },
      adminMode: false,
      currentTeamsTurn: "",
      isPad: window.innerWidth >= 750,
      newTeamName: "",
      konami: null
    };
  },
  computed: {
    gameOver: function() {
      if (this.question.id == -2) return true;
      return false;
    },
    winningTeam: function() {
      var maxScore = 0;
      var maxTeamName = "";
      this.teams.forEach(x => {
        if (x.score == maxScore) {
          maxTeamName += " and " + x.name;
        }
        if (x.score > maxScore) {
          maxScore = x.score;
          maxTeamName = x.name;
        }
      });
      return maxTeamName;
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
    gameTimesUp: function() {
      this.$socket.emit(ROOT + "buzz", "");
    },
    gameBuzz: function() {
      this.$socket.emit(ROOT + "buzz", this.playerTeam);
    },
    gameSuperBuzz: function(teamName) {
      this.$socket.emit(ROOT + "super buzz", teamName);
    },
    gameAddTeam: function() {
      var teamName = this.newTeamName;
      this.$socket.emit(ROOT + "add team", teamName);
    },
    gameCorrect: function() {
      var questionId = this.question.id;
      this.$socket.emit(ROOT + "correct", questionId);
    },
    gameIncorrect: function() {
      var questionId = this.question.id;
      this.$socket.emit(ROOT + "incorrect", questionId);
    },
    gameSkipQuestion: function() {
      var questionId = this.question.id;
      this.$socket.emit(ROOT + "skip", questionId);
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
      if (this.question.id != -1 && this.question.id != question.id && typeof window.navigator.vibrate !== "undefined"){
        window.navigator.vibrate(200);
        console.log("Attempting to vibrate");
      }
      this.question.id = question.id;
      this.question.person = question.person;
    },
    "Gameshow:team turn": function(teamTurn) {
      this.currentTeamsTurn = teamTurn;
    },
    "Gameshow:play sound": function(sound) {
      if (this.isPad) {
        if (sound == "incorrect") {
          console.log("Wrong sound effect");
          var audio = new Audio("/static/gameshow/negative-beeps.wav");
          audio.play();
        }
        if (sound == "correct") {
          console.log("Correct sound effect");
          var audio = new Audio("/static/gameshow/positive-beeps.wav");
          audio.play();
        }
      }
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
.btn-huuge {
  padding: 2.5rem 2rem;
  font-size: 2.25rem;
  line-height: 3rem;
}
</style>