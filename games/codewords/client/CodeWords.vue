<template>
   <div class="container-fluid">
        <div v-if="gameID != '' && !isPhone && winner == '' ">
            <div class="text-center" :style="{ 'background-color': currentTurn}">Currently {{currentTurn}}'s turn</div>
            <div v-if="words.length > 0">
                <div class="row" v-for="i in Math.ceil(words.length / 5)">
                    <div class="col text-center codeword" @click="GuessWord(index+((i-1)*5))" v-for="code,index in words.slice((i - 1) * 5, i * 5)">
                        <!--{{board[index+((i-1)*5)]}}-->
                        <div class="card panel-default" :style="{ 'height': boxHeight}" :class="{ 'red':wordsGuessed[index+((i-1)*5)] && board[index+((i-1)*5)] =='red', 'blue':wordsGuessed[index+((i-1)*5)] && board[index+((i-1)*5)] =='blue', 'none':wordsGuessed[index+((i-1)*5)] && board[index+((i-1)*5)] =='none', 'death':wordsGuessed[index+((i-1)*5)] && board[index+((i-1)*5)] =='death'}">
                            <div class="card-header upsidedown" v-if="!wordsGuessed[index+((i-1)*5)]">
                                {{code}}
                            </div>
                            <div v-else class="card-header upsidedown">
                                    <span>{{board[index+((i-1)*5)]}}</span>
                                </div>
                            <div class="card-block" :style="{ 'height': boxHeight}" v-if="!wordsGuessed[index+((i-1)*5)]">
                                <b>{{code}}</b>
                            </div>
                            <div v-else class="card-block" :style="{ 'height': boxHeight}">
                                <span>{{board[index+((i-1)*5)]}}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-else>
                <h2 class="text-center">Loading words...</h2>
            </div>
            <br/>
            <!--hr/-->
            <div class="row">
                <div class="col">
                    <button class="btn btn-danger btn-block btn-sm" @click="EndGame">End Game</button>
                </div>
                <div class="col">
                    <button class="btn btn-info btn-block btn-sm" @click="EndTurn">End Turn</button>
                </div>
            </div>
        </div>
        <div v-else-if="gameID != '' && role == '' && winner == ''" class="container">
            <br/>
            <h2>Pick your Team</h2>
            <button class="btn btn-block btn-danger" @click="SetColor('red')">Red</button>
            <button class="btn btn-block btn-primary" @click="SetColor('blue')">Blue</button>
        </div>
        <div v-else-if="gameID != '' && winner == ''" class="container">
            <div class="text-center">Currently {{(role ==currentTurn)?"your":"not your"}} turn</div>
            <button class="btn btn-block btn-info" v-if="role == currentTurn" @click="EndTurn">End Turn</button>
            <h2>Your Words</h2>
            <ul>
                <li v-for="word in MyColor">{{word}}</li> 
            </ul>
            <b>Suggested Clues</b>
            <button class="btn btn-block btn-primary" @click="showSuggestions = !showSuggestions">Toggle suggested word</button>
            <pre v-if="showSuggestions">{{SuggestedClues}}</pre>
            <h2>Their words</h2>
            <ul>
                <li v-for="word in TheirColor">{{word}}</li>
            </ul>
            <h2>Death word</h2>
            <ul>
                <li v-for="word in DeathWord">{{word}}</li>
            </ul>
            <h2>Neutral</h2>
            <ul>
                <li v-for="word in NoColor">{{word}}</li>
            </ul>
            <h2>Guessed Words</h2>
            <ul>
                <li v-for="word in Guessed">{{word}}</li>
            </ul>
            <br/>
            <hr/>
            <div class="col">
                <button class="btn btn-success btn-block btn-sm" @click="LeaveGame">Leave Game</button>
            </div>
        </div>

        <div v-else-if="gameID != '' && winner != '' && role == ''" class="container">
            <h1 class="text-center">Winner: {{winner}}</h1>
            <div class="col">
                <button class="btn btn-success btn-block btn-sm" @click="LeaveGame">Leave Game</button>
            </div>

        </div>
        <div v-else-if="gameID != '' && winner == role" class="container">
            <h1 class="text-center">Winner winner chicken dinner!</h1>
            <div class="col">
                <button class="btn btn-success btn-block btn-sm" @click="LeaveGame">Leave Game</button>
            </div>

        </div>
        <div v-else-if="gameID != '' && winner != ''" class="container">
            <h1>You've lost!</h1>
            <div class="col">
                <button class="btn btn-success btn-block btn-sm" @click="LeaveGame">Leave Game</button>
            </div>

        </div>

        <div v-else-if="gameID == ''" class="container">
            <h2>Join a game!</h2>
            <ul class="list-group">
                <a v-for="game in gamelist" class="list-group-item" @click="JoinGame(game)">{{game}}</a>
            </ul>
            <hr/>
            <input type="text" class="form-control" placeholder="Name your game" v-model="newGameName" />
            <button class="btn btn-block btn-primary" @click="CreateGame">Create a game</button>
        </div>
    </div>
</template>

<script>
import io from "socket.io-client";
import Vue from "vue";
import loadModel from "../common/model";
//TODO move this to a static asset that should be loaded
import trainedmodel from "../common/data.json";

var width =
  window.innerWidth ||
  document.documentElement.clientWidth ||
  document.body.clientWidth;

//TODO SET style automatically to scale to fit screens
var height =
  window.innerHeight ||
  document.documentElement.clientHeight ||
  document.body.clientHeight;

var boxHeight = (height - 100) / 5;
function OppositeColor(color) {
  return color == "red" ? "blue" : "red";
}

export default {
  name: "Sushies",
  data() {
    return {
      gameID: "",
      gamelist: [],
      newGameName: "",
      role: "",
      socket: io(),
      currentTurn: "red",
      winner: "",
      words: [],
      board: [],
      model: null,
      wordsGuessed: [],
      showSuggestions: false,
      isPhone: width < 500,
      boxHeight: boxHeight - 5 + "px"
    };
  },
  mounted: function() {
    var app = this;
    console.log(app);
    app.socket.on("create game", this.AddGame);
    app.socket.on("game list", function(gameList) {
      console.log(gameList);
      app.gamelist = gameList;
    });
    app.socket.on("word list", function(newwords) {
      app.words = newwords;
      console.log("Updating words");
    });
    app.socket.on("guesses", function(newGuesses) {
      app.wordsGuessed = newGuesses;
      console.log("Updating guesses", app.wordsGuessed);
    });
    app.socket.on("guess word", function(guess) {
      // Vue.set
      Vue.set(app.wordsGuessed, guess, true);
      console.log("Updating guess for index " + guess);
    });
    app.socket.on("game board", function(newBoard) {
      app.board = newBoard;
      console.log("Updating board");
    });
    app.socket.on("end turn", function(newPlayerColor) {
      app.currentTurn = newPlayerColor;
    });
    app.socket.on("game won", function(winner) {
      app.winner = winner;
    });
    var self = this;
    if (this.isPhone) {
      loadModel(trainedmodel, function(data, newModel) {
        console.log("Loaded model", data);
        self.model = newModel;
      });
    }
  },
  methods: {
    CreateGame: function() {
      console.log("Creating a game");
      if (this.newGameName == "") return;
      this.socket.emit("create game", this.newGameName);
    },
    AddGame: function(game) {
      this.gamelist.push(game);
    },
    JoinGame: function(game) {
      console.log("Joining game" + game);
      this.gameID = game;
      this.words = [];
      this.winner = "";
      this.role = "";
      this.socket.emit("join game", game);
      for (var i = 0; i < 25; i++) Vue.set(this.wordsGuessed, i, false);
    },
    GuessWord: function(index) {
      this.socket.emit("guess word", [this.gameID, index]);
      Vue.set(this.wordsGuessed, index, true);
      if (this.board[index] != this.currentTurn)
        this.currentTurn = OppositeColor(this.currentTurn);
    },
    EndGame: function() {
      this.socket.emit("end game", this.gameID);
      this.LeaveGame();
    },
    LeaveGame: function() {
      this.gameID = "";
    },
    SetColor: function(color) {
      this.role = color;
    },
    EndTurn: function() {
      //if (this.currentTurn == this.role)
      this.socket.emit("end turn", this.gameID);
    }
  },
  computed: {
    MyColor: function() {
      var board = this.board;
      var currentColor = this.role;
      var guesses = this.wordsGuessed;
      return this.words.filter(function(value, index) {
        return board[index] == currentColor && !guesses[index];
      });
    },
    TheirColor: function() {
      var board = this.board;
      var currentColor = OppositeColor(this.role);
      var guesses = this.wordsGuessed;
      return this.words.filter(function(value, index) {
        return board[index] == currentColor && !guesses[index];
      });
    },
    DeathWord: function() {
      var board = this.board;
      var currentColor = "death";
      var guesses = this.wordsGuessed;
      return this.words.filter(function(value, index) {
        return board[index] == currentColor && !guesses[index];
      });
    },
    SuggestedClues: function() {
      if (!this.isPhone) return [];
      var suggestedClues = [];
      var self = this;
      this.MyColor.forEach(value => {
        var results = self.model.mostSimilar("/en/" + value);
        suggestedClues.push({ source: value, result: results[0] });
      });
      this.MyColor.forEach((value, index) => {
        for (var index2 = index + 1; index2 < self.MyColor.length; index2++) {
          if (index == index2) return;
          var value2 = self.MyColor[index2];
          var results = self.model.mostSimilar(
            "/en/" + value + " /en/" + value2
          );
          suggestedClues.push({
            source: value + "+" + value2,
            result: results[0]
          });
          var results2 = self.model.mostSimilar("/en/" + value2 + " /en/" + value);
          if (results2.word != results.word){
            suggestedClues.push({
              source: value2 + "+" + value,
              result: results[0]
            });
            console.log("Found alternate word");
          }
        }
      });
      //TODO figure out which clues are unique. If there's multiple words that correspond to the same clue, then merge them or detract the distance score
      suggestedClues.sort((a, b) => b.result.dist - a.result.dist);
      //filter down to the top four
      //trip down to the best 4 or so
      return suggestedClues;
    },
    NoColor: function() {
      var board = this.board;
      var currentColor = "none";
      var guesses = this.wordsGuessed;
      return this.words.filter(function(value, index) {
        return board[index] == currentColor && !guesses[index];
      });
    },
    Guessed: function() {
      var board = this.board;
      var guesses = this.wordsGuessed;
      return this.words.filter(function(value, index) {
        return guesses[index];
      });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.upsidedown {
  -webkit-transform: rotate(-180deg);
  -moz-transform: rotate(-180deg);
  -o-transform: rotate(-180deg);
  transform: rotate(-180deg);
  ms-filter: "progid:DXImageTransform.Microsoft.BasicImage(rotation=2)";
  filter: progid:DXImageTransform.Microsoft.BasicImage(rotation=2);
}

.upsidedown.card-header {
  padding: 0;
}

.codeword {
  margin-top: 0.5em;
}

body {
  height: 100vh;
  background-color: #eee;
}

.card-block {
  display: flex;
  align-items: center;
  /* Vertical center alignment */
  justify-content: center;
  /* Horizontal center alignment */
}
.card.red {
  border: 2px solid darkred;
  color: white;
  background-color: red;
}
.card.blue {
  border: 2px solid darkblue;
  color: white;
  background-color: blue;
}
.card.none {
  border: 2px solid yellow;
  color: white;
  background-color: gold;
}
.card.death {
  border: 2px solid black;
  color: white;
  background-color: #222;
}

.card-block b {
  display: inline-block;
  vertical-align: middle;
  font-size: 2vw;
}
.card-block span {
  font-size: 2vw;
}
</style>
