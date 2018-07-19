<template>
<div class="content">
   <div class="container-fluid" v-if="playerID == -1">
      <h2>The Game of Stuff!</h2>
      <hr/>
      <h3>Current Players</h3>
      <div v-for="player in players"  v-bind:key="player">{{player}}</div>
      <hr/>
      <h3>Please Input Your Name to Join</h3>
      <input type="text" class="form-control" placeholder="Your name" v-model="playerName" />
      <button @click="JoinGame()" class="btn btn-success btn-block">Join Game</button>
      
    </div>
    <div class="container-fluid" v-else-if="state == 'waiting'">        
        <div class ="well" >
          <strong>Waiting for more players to join:</strong>
          <div v-for="player in players"  v-bind:key="player">{{player}}</div>
        </div>
        <br/>
        <div>In this game, you will be asked to answer a question. Don't let anyone see what you answer!</div>
        <div>After everyone has answered, people will have to guess who said what!</div>
        <div>When it's your turn, guess someone and see if you're right.
          If you're right, they will press the "I was guessed by" button with your name on it! So make sure everyone is paying attention.
          Once you guess incorrectly, your turn is over and it goes to the next person.
          Once you've been guessed, you can't guess anymore and you're out of this round.
          Guessing another person's answer gives you one point and being the last one to guess gives you an extra 2 points.
        </div>
    </div>
    <div class="container-fluid" v-else-if="state == 'question'">      
      <h2>Question: Stuff {{question}}</h2>
      <div v-if="!AnswerSubmitted">
        <input type="text" class="form-control" placeholder="Your answer" v-model="answer" />
        <button @click="Answer()" class="btn btn-success btn-block">Answer</button>
      </div>
      <div v-else>
        Waiting for everyone else to answer
      </div>      
      <div v-for="player,index in players" v-bind:key="player+index">
        {{player}} : <span v-if="playerAnswers[index] != ''">Ready</span><span v-else>Thinking</span>
      </div>
      <!--{{playerAnswers}}-->
      <h4>Scores:</h4>
       <div v-for="player,index in players" v-bind:key="player+index">
        {{player}} : {{scores[index]}} 
      </div>
    </div>
    <div class="container-fluid" v-else-if="state == 'guessing'">
        <h2>Question: Stuff {{question}}</h2>
        <h3>Your answer: <small>{{answer}}</small></h3>
        <div>It is currently {{players[currentPlayerTurn]}}'s turn</div>
        <div v-if="currentPlayerTurn == playerIndex">
          <b class="text-center">It's YOUR turn</b>
          <button class="btn-block btn btn-secondary">I guessed incorrectly</button>
        </div>
        <div v-if="playerAnswers[PlayerIndex]!=''">
          <h3 v-if="IsFirstGuesser">You get to guess first!</h3>
          Who guessed you?
          <button class="btn-block btn btn-secondary" 
            @click="Guessed(index)" v-for="player,index in players" 
            v-bind:key="player+index" 
            v-if="index != PlayerIndex && playerAnswers[index] != '' && player != 'AI'">{{player}}</button>
          <h3>Answers:</h3>
          <ul><li v-for="answer in shuffle(oldPlayerAnswers)">{{answer}}</li> </ul>
        </div>
        <div v-else>You've been guessed!</div>
    </div>
    <br/>
    <hr/>
      <div v-if="votesToEnd > 0">{{votesToEnd}} people have voted to end the game</div>
      <button @click="VoteToEnd()" class="btn btn-warning btn-sm">Vote to End the Game</button>    
      <button @click="LeaveGame()" class="btn btn-danger btn-sm">Leave Game</button>    
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
    //the main syncing method
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

      if (this.numQuestions != newgame.questions.length) {
        this.answer = "";
        this.numQuestions = newgame.questions.length;
      }

      this.currentPlayerTurn = newgame.currentPlayerTurn;

      this.votesToEnd = newgame.votesToEnd.reduce(
        (prev, curr) => (curr ? prev + 1 : prev),
        0
      );

      //if it doesn't contain the
      if (
        newgame.state == "guessing" &&
        (!newgame.playerAnswers.some(x => x == "") ||
          this.oldPlayerAnswers.length == 0)
      ) {
        this.oldPlayerAnswers = newgame.playerAnswers;
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