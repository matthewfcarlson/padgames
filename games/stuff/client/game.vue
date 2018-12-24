<template>
  <div class="content">
    <div class="container-fluid" v-if="playerID == -1">
      <h2>The Game of Stuff!</h2>
      <hr>
      <h3>Current Players</h3>
      <div v-for="player in players" v-bind:key="player">
        {{player}}
        <button
          class="btn btn-sm pull-right"
          @click="JoinGame(null,player)"
        >Rejoin as this player</button>
      </div>
      <hr>
      <h3>Please Input Your Name to Join</h3>
      <input type="text" class="form-control" placeholder="Your name" v-model="playerName">
      <button @click="JoinGame()" class="btn btn-success btn-block">Join Game</button>
    </div>
    <div class="container-fluid" v-else-if="state == 'waiting'">
      <div class="well">
        <strong>Waiting for more players to join:</strong>
        <div v-for="player in players" v-bind:key="player">{{player}}</div>
      </div>
      <br>
      <div>In this game, you will be asked to answer a question. Don't let anyone see what you answer!</div>
      <div>After everyone has answered, people will have to guess who said what!</div>
      <div>
        When it's your turn, guess someone and see if you're right.
        If you're right, they will press the "I was guessed by" button with your name on it! So make sure everyone is paying attention.
        Once you guess incorrectly, your turn is over and it goes to the next person.
        Once you've been guessed, you can't guess anymore and you're out of this round.
        Guessing another person's answer gives you one point and being the last one to guess gives you an extra 2 points.
      </div>
    </div>
    <div class="container-fluid" v-else-if="state == 'question'">
      <h2>Question: Stuff {{question}}</h2>
      <div v-if="!AnswerSubmitted">
        <input type="text" class="form-control" placeholder="Your answer" v-model="answer">
        <button @click="Answer()" class="btn btn-success btn-block">Answer</button>
      </div>
      <div v-else>Waiting for everyone else to answer</div>
      <div v-for="(player,index) in players" v-bind:key="'think'+player+index">
        {{player}} :
        <span v-if="playerAnswers[index] != ''">Ready</span>
        <span v-else>Thinking</span>
      </div>
      <!--{{playerAnswers}}-->
      <h4>Scores:</h4>
      <div
        v-for="(player,index) in players"
        v-bind:key="'score'+player+index"
      >{{player}} : {{scores[index]}}</div>
    </div>
    <div class="container-fluid" v-else-if="state == 'guessing'">
      <h2>Question: Stuff {{question}}</h2>
      <h3>
        Your answer:
        <small style="font-size:7pt;">{{answer}}</small>
      </h3>
      <div>It is currently {{players[currentPlayerTurn]}}'s turn</div>
      <div v-if="currentPlayerTurn == PlayerIndex">
        <b class="text-center">It is YOUR turn</b>
        <button @click="EndTurn()" class="btn-block btn btn-warning">I guessed incorrectly</button>
        <div>Guess people until you get one wrong</div>
        <h3>Answers:</h3>
        <ul>
          <li v-for="answer in shuffle(oldPlayerAnswers)" :key="answer">{{answer}}</li>
        </ul>
      </div>
      <div v-else-if="playerAnswers[PlayerIndex]!=''">
        Who guessed you?
        <button
          class="btn-block btn btn-danger"
          @click="Guessed(currentPlayerTurn)"
          v-if="index != currentPlayerTurn >=0 && currentPlayerTurn<players.length && playerAnswers[currentPlayerTurn] != '' && player != 'AI'"
        >
          I was guessed by
          <b>{{players[currentPlayerTurn]}}</b>
        </button>
        <div>
          <small>Do not click one of these buttons unless someone guesses you!</small>
        </div>
      </div>
      <div v-else>You've been guessed!</div>
    </div>
    <br>
    <hr>
    <div v-if="votesToEnd > 0">{{votesToEnd}} people have voted to end the game</div>
    <button @click="VoteToEnd()" class="btn btn-warning btn-sm">Vote to End the Game</button>
    <button @click="LeaveGame()" class="btn btn-danger btn-sm">Leave Game</button>
    <div v-if="playerID == 0">Click to boot a player</div>
  </div>
</template>
<script>
//<div v-if="playerAnswers[index] != undefined && playerAnswers[index].length == 0">???</div>
import Vue from "vue";
import VueSocketio from "vue-socket.io";
import Questions from "../common/questions.js";

/**
 * Shuffles array in place. ES6 version
 * @param {Array} a items An array containing the items.
 */

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
      currentPlayerTurn: 0,
      syncTimer: null,
      lastSyncTime: 0,
      players: [],
      scores: [],
      playerAnswers: [""],
      votesToEnd: 0,
      oldPlayerAnswers: [""], //this stores the old player answers?
      game: null,
      playerName: "",
      numQuestions: 0
    };
  },
  methods: {
    StartGame: function() {
      this.$socket.emit(ROOT + "start game");
    },
    JoinGame: function(gameRoom, playerName) {
      if (gameRoom == undefined) gameRoom = this.gameRoom;
      if (playerName == undefined) playerName = this.playerName;
      if (playerName == "") return;
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
    },

    EndTurn: function(gameRoom) {
      if (gameRoom == undefined) gameRoom = this.gameRoom;
      this.$socket.emit(ROOT + "end turn", gameRoom);
    },

    VoteToEnd: function(gameRoom) {
      if (gameRoom == undefined) gameRoom = this.gameRoom;
      this.$socket.emit(ROOT + "vote end", gameRoom);
    },
    shuffle: function(a) {
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    },
    TimedSync() {
      console.log("Asking to sync",  this.lastSyncTime);
      this.$socket.emit(ROOT + "sync game", this.gameRoom, this.lastSyncTime);
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
    },
    IsFirstGuesser: function() {
      if (this.playerID < 1) return false;
      var guesserIndex = this.numQuestions % this.players.length;
      if (this.PlayerIndex == guesserIndex) return true;
      return false;
    }
  },
  created: function() {
    this.gameRoom = this.$route.params.gameID || "";
  },
  mounted() {
    this.$socket.emit(ROOT + "connect");
  },
  sockets: {
    "stuff:connect": function() {
      if (this.connected) return;
      console.log("socket connected for room " + this.gameRoom);
      this.connected = true;
      this.TimedSync();
      if (this.syncTimer != null) clearInterval(this.syncTimer);
      this.syncTimer = setInterval(this.TimedSync, 5000);
    },

    "stuff:error": function(message, leave) {
      alert(message + leave);
      if (leave != undefined && leave == true) {
        console.log("Leaving game");
        LeaveGame();
      }
    },
    //the main syncing method
    "stuff:sync game": function(newgame) {
      console.log("Sync Game:", newgame);
      if (newgame == undefined) {
        console.error("Bad new game");
        return;
      }
      //TODO do this better
      var self = this;
      this.players.splice(0, this.players.length);
      newgame.players.forEach(x => self.players.push(x));

      this.scores.splice(0, this.scores.length);
      newgame.scores.forEach(x => self.scores.push(x));

      this.question = Questions.questions[newgame.questions[0]];

      if (newgame.playerAnswers != undefined) {
        this.playerAnswers.splice(0, this.playerAnswers.length);
        newgame.playerAnswers.forEach(x => self.playerAnswers.push(x));
      }

      this.state = newgame.state;

      if (this.numQuestions != newgame.questions.length) {
        this.answer = "";
        this.numQuestions = newgame.questions.length;
      }

      this.currentPlayerTurn = newgame.currentPlayerTurn % this.players.length;

      this.votesToEnd = newgame.votesToEnd.reduce(
        (prev, curr) => (curr ? prev + 1 : prev),
        0
      );

      this.lastSyncTime = newgame.lastCommandTime;

      //if it doesn't contain the
      if (
        newgame.state == "guessing" &&
        (!newgame.playerAnswers.some(x => x == "") ||
          this.oldPlayerAnswers.length == 0)
      ) {
        this.oldPlayerAnswers.splice(0, this.oldPlayerAnswers.length);
        newgame.playerAnswers.forEach(x => self.oldPlayerAnswers.push(x));
        //TODO store old answers server side so this syncs properly
      }

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