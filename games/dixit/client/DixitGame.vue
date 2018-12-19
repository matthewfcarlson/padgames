<template>
  <div class="content">Dixit
    <div v-if="state == 'lobby'">
      <div is="LobbyPlayerList" v-bind:players="playerList"></div>
      <br>
      <div v-if="playerIndex == -1 && !isPad">
        <h3>Join game</h3>
        <input type="text" class="form-control" placeholder="Your name" v-model="playerName">
        <br>
        <button class="btn btn-primary btn-block" @click="JoinGame()">Join Game</button>
        <button
          class="btn btn-info btn-block"
          @click="JoinGameAsPad()"
        >Join Game as iPad/Large Screen</button>
      </div>
      <button
        v-else-if="isFirstPlayer"
        class="btn btn-primary btn-block"
        @click="StartGame"
      >Start Game</button>
      <div v-else class="btn btn-info btn-block" disabled>Waiting for the game to start</div>
      <vue-qrcode v-bind:value="windowLocation" class="text-center" :options="{ width: qrWidth }"></vue-qrcode>
    </div>
    <div v-else-if="state == 'firstcard'">
      <div v-if="isStoryTeller">Pick a card and tell your story
        <div is="cardPicker" story-teller="true" :hand="myHand" @submit="PickCard"></div>
      </div>
      <div v-else>Waiting for the story teller to pick a card and tell you the story.</div>
    </div>
    <div v-else-if="state == 'allcards'">
      <div v-if="!isPad && !isStoryTeller">
        <div is="cardPicker" :story-teller=false :hand="myHand" @submit="PickCard"></div>
      </div>
      <div v-else>
        Waiting for players to put in their cards
        TODO: Add list of players who have answered
      </div>
    </div>
    <div v-else-if="state == 'voting'">
      <div v-if="!isStoryTeller">
        <div is="CardVoter" :isPad="isPad" :cardList="shuffledCardVoteList" @submit="VoteCard"></div>
      </div>
      <div v-else>Waiting for players to vote</div>
    </div>
    <div v-else-if="state == 'endgame'">
      <h2>Game Over!</h2>
    </div>

    <div v-if="state != 'lobby'" is="Scores" :players="playerList" :isPad="isPad" :scores="scores"></div>
    <div v-if="state != 'lobby' && isFirstPlayer">
      <h2>Admin Controls</h2>
      <hr>
      <h3>Boot player</h3>
      <div is="LobbyPlayerList" v-bind:players="playerList"></div>
      <button class="btn btn-danger btn-block" @click="EndGame">End Game</button>
    </div>
    <pre v-if="debug">
        state: {{state}}
        {{currentGame}}
        connected: {{connected}}
    </pre>
  </div>
</template>

<script>
import Vue from "vue";
import VueSocketio from "vue-socket.io";
import VueQrcode from "@chenfengyuan/vue-qrcode";
import DixitGame from "../common/dixit";
import LobbyPlayerList from "./LobbyPlayerList";
import CardPicker from "./CardPicker";
import CardVoter from "./CardVoter";
import Scores from "./Scores";

Vue.use(VueSocketio, window.location.origin);

const SYNC_TIME = 10000;
const ROOT = "Dixit:";

export default {
  name: "Dixit",
  data() {
    var self = this;
    var gameRoom = this.$route.params.gameID || "";
    var debug =
      location.hostname === "localhost" || location.hostname === "127.0.0.1";

    return {
      currentGame: DixitGame.CreateGame(gameRoom, function(name, args) {
        console.log(
          "Broadcast up to the server that we called this ",
          name,
          args
        );
        self.$socket.emit(ROOT + "engine call", gameRoom, name, args);
      }),
      windowLocation: window.location.href,
      syncTimer: null,
      playerIndex: -1,
      playerName: debug ? "Default" : "",
      gameRoom: gameRoom,
      debug: debug,
      isPad: false
    };
  },
  components: {
    VueQrcode,
    LobbyPlayerList,
    CardPicker,
    CardVoter,
    Scores
  },
  mounted: function() {
    console.log(this.sockets);
    console.log(this.$options.sockets);
    console.log(this);
    console.log(this.$socket);
    this.$socket.emit(ROOT + "connect");
  },
  created: function() {
    var names = [
      "Billy",
      "Bob",
      "Joe",
      "Sue",
      "Ellen",
      "Tj",
      "Safiye",
      "Jeff",
      "Kira",
      "Matt",
      "Jeremy",
      "Star",
      "James",
      "Lily",
      "Simon",
      "Norman",
      "Ruby",
      "Craig",
      "Dominica",
      "Ruth"
    ];
    if (this.playerName == "Default")
      this.playerName = names[Math.floor(Math.random() * names.length)];
  },
  computed: {
    qrWidth: function() {
      var value = window.screen.width;
      if (value > 750) return 750;
      return window.screen.width;
    },
    state: function() {
      if (this.currentGame == null) return "";
      return this.currentGame.GetState();
    },
    myHand: function(){
      if (this.currentGame == null) return [];
      return this.currentGame.GetPlayerHand(this.playerIndex);
    },
    isFirstPlayer: function() {
      if (this.playerIndex == 0) return true;
      return false;
    },
    playerList() {
      if (this.currentGame == null) return [];
      return this.currentGame.GetPlayers();
    },
    scores() {
      if (this.currentGame == null) return [];
      return this.currentGame.GetScores();
    },
    isStoryTeller: function() {
      if (this.playerIndex == -1) return false;
      if (this.currentGame == null) return false;
      if (this.currentGame.GetStoryTeller() == this.playerIndex) return true;
      return false;
    },
    hasPad() {
      //if there is an ipad attached
      if (this.currentGame == null) return false;
      return this.currentGame.GetPadAttached();
    },
    shuffledCardVoteList() {
      //the list of cards we can vote on
      if (this.currentGame == null) return [];
      return this.currentGame.GetVoteCardList(); //how to shuffle this the same way every time?
    }
  },
  methods: {
    StartGame: function() {
      this.currentGame.replicated.StartGame();
    },
    JoinGame: function(gameRoom, playerName) {
      if (gameRoom == undefined) gameRoom = this.gameRoom;
      if (playerName == undefined) playerName = this.playerName;
      if (playerName == "") return;
      document.title = "Dixit - " + playerName;
      this.$socket.emit(ROOT + "join game", gameRoom, playerName);
    },
    TimedSync: function() {
      if (this.currentGame == null) return;
      var lastCommand = this.currentGame.GetLastCommandTime();
      var date = new Date();
      var gameRoom = this.gameRoom;
      var current_time = date.getTime();
      var elapsedTime = current_time - lastCommand;
      console.log(
        "There have been " +
          elapsedTime +
          " since we last synced or recieved a command"
      );
      if (elapsedTime > SYNC_TIME) {
        this.$socket.emit(ROOT + "sync game", gameRoom, lastCommand);
      }
      //otherwise we check how long it has been since we got the last command
    },
    JoinGameAsPad() {
      var gameRoom = this.gameRoom;
      this.$socket.emit(ROOT + "join game pad", gameRoom);
    },
    RejoinGame: function(gameRoom, playerName, playerIndex, socketId) {
      console.log("Attempting to rejoin the game!");
      this.$socket.emit(
        ROOT + "rejoin game",
        gameRoom,
        playerName,
        playerIndex,
        socketId
      );
    },
    LeaveGame: function() {
      var newPage = location.origin + "/dixit";
      console.log("Leaving", newPage);
      window.location.assign(newPage);
    },
    PickCard: function(cardIndex) {
      console.log("Attempting to pick a card ", cardIndex);
      this.currentGame.replicated.PickCard(this.playerIndex, cardIndex);
    },
    VoteCard: function(cardIndex) {
      console.log("Attempting to vote on the card at ", cardIndex);
      this.currentGame.replicated.VoteCard(this.playerIndex, cardIndex);
    }
  },
  sockets: {
    disconnect: function() {
      //let us know that we are disconnected
    },
    "Dixit:connected": function() {
      var gameRoom = this.gameRoom;
      this.$socket.emit(ROOT + "listen", gameRoom);
      console.log("socket connected for room " + gameRoom);
      this.$socket.emit(ROOT + "sync game", gameRoom, 0);

      if (this.connected) return;

      this.connected = true;
      var self = this;

      //how to figure out if we've connected before

      var previousGame = null;
      if (localStorage.getItem(gameRoom) && this.playerIndex == -1) {
        previousGame = JSON.parse(localStorage.getItem(gameRoom));
        console.log(this);
        this.RejoinGame(
          gameRoom,
          previousGame.playerName,
          previousGame.index,
          previousGame.socketId
        );
        this.playerName = previousGame.playerName;
        localStorage.removeItem(gameRoom);
      }
      console.log("Previous game", previousGame);
      // set a timer to sync
      if (this.syncTimer != null) clearInterval(this.syncTimer);
      this.syncTimer = setInterval(this.TimedSync, 5000);
    },
    "Dixit:error": function(response) {
      var message = "N/A";
      var leave = false;
      console.error(response);

      if (response["leave"] != undefined) leave = response["leave"];
      if (leave != undefined && leave == true) {
        console.log("Leaving game");
        this.LeaveGame();
      } else if (response["msg"] != undefined) {
        message = response["msg"];
        alert(message);
      }
    },
    "Dixit:set player": function(playerIndex) {
      console.log("Player ID" + playerIndex);
      //TODO do this better
      this.playerIndex = playerIndex;

      if (this.playerIndex == -1) {
        this.isPad = true;
        return;
      }
      console.log("Storing the game for later");
      localStorage.setItem(
        this.gameRoom,
        JSON.stringify({
          playerName: this.playerName,
          index: playerIndex,
          socketId: this.$socket.id
        })
      );
    },
    "Dixit:engine call": function(data) {
      console.log(
        "We got a response from the server to call our engine with func " +
          data.funcName +
          " from " +
          data.source,
        data
      );
      if (this.$socket.id == data.source) {
        console.log("Ignoring");
      } else {
        this.currentGame.ApplyFunc(data.funcName, data.argList, data.time);
        Vue.set(this, "currentGame", this.currentGame);
      }
    }
  }
};
</script>
<style>
</style>

