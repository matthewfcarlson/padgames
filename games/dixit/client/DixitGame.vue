<template>
<div class="content" >
    Dixit
    <vue-qrcode v-bind:value="windowLocation" class="text-center" :options="{ width: qrWidth }"></vue-qrcode>
    <pre>
        {{currentGame}}
    </pre>
</div>
</template>

<script>
import Vue from "vue";
import VueSocketio from "vue-socket.io";
import VueQrcode from '@chenfengyuan/vue-qrcode';
import DixitGame from "../common/dixit"

Vue.use(VueSocketio, window.location.origin);
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
      syncTimer:null,
      playerIndex: -1,
      playerName: debug ? "Default" : "",
      gameRoom: gameRoom,
      debug: debug
    };
  },
  components: {
    VueQrcode,
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
    qrWidth: function(){
      var value = window.screen.width;
      if (value > 750) return 750;
      return window.screen.width;
    },
  },
  methods: {
    StartGame: function() {
      this.currentGame.replicated.StartGame();
    },
    JoinGame: function(gameRoom, playerName) {
      if (gameRoom == undefined) gameRoom = this.gameRoom;
      if (playerName == undefined) playerName = this.playerName;
      if (playerName == "") return;
      document.title = "Arguing - " + playerName;
      this.$socket.emit(ROOT + "join game", gameRoom, playerName);
    },
    TimedSync: function(){
      if (this.currentGame == null) return;
      var lastCommand = this.currentGame.GetLastCommandTime();
      var date = new Date();
      var gameRoom = this.gameRoom;
      var current_time = date.getTime();
      var elapsedTime = current_time - lastCommand;
      console.log("There have been "+elapsedTime+" since we last synced or recieved a command");
      if (elapsedTime > 5000){
        this.$socket.emit(ROOT + "sync game", gameRoom, lastCommand);
      }      
      //otherwise we check how long it has been since we got the last command

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
      this.$router.push("/dixit");
    }
  },
  sockets: {
    connect: function() {
      var gameRoom = this.gameRoom;
      console.log("socket connected for room " + gameRoom);
      this.connected = true;
      this.$socket.emit(ROOT + "connect");
      this.$socket.emit(ROOT + "sync game", gameRoom, 0);
      var self = this;

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
      this.syncTimer = setInterval(this.TimedSync, 5000);
      
    },
    "Dixit:error": function(message, leave) {
      alert(message + leave);
      if (leave != undefined && leave == true) {
        console.log("Leaving game");
        LeaveGame();
      }
    },
    "Dixit:set player": function(playerIndex) {
      console.log("Player ID" + playerIndex);
      //TODO do this better
      this.playerIndex = playerIndex;
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
        this.currentGame.ApplyFunc(data.funcName, data.argList,data.time);
        Vue.set(this, "currentGame", this.currentGame);
      }
    }
  }
};
</script>
<style>

</style>

