<template>
<div class="content">
    <h1>Arguable Game</h1>
    <div>
        <button @click="AddPlayer">Add Player</button>
        <button @click="AddServerPlayer">Send to Server</button>
        <button @click="StartGame">Start Game</button>
        <button @click="JoinGame()">Join Game</button>
        {{ currentGame }}
    </div>
    
</div>
</template>

<script>
import Vue from "vue";
import VueSocketio from "vue-socket.io";
import ArgueGame  from "../common/argueGame";

Vue.use(VueSocketio, window.location.origin);
const ROOT = "Argue:";
export default {
  name: "Arguable",
  data() {
    return {
        currentGame: null,
        count:0,
        playerName: "Default",
    }
  },
  created: function() {
    this.gameRoom = this.$route.params.gameID || "";
  },
  methods: {
    StartGame: function() {
      this.currentGame.replicated.StartGame();
    },
    JoinGame: function(gameRoom, playerName) {
      if (gameRoom == undefined) gameRoom = this.gameRoom;
      if (playerName == undefined) playerName = this.playerName;
      if (playerName == "") return;
      const game = ArgueGame.CreateGame(this.gameRoom, this.CalledFunction);
      this.currentGame = game;
      this.$socket.emit(ROOT + "join game", gameRoom, playerName);
    },
    AddPlayer: function(){
        this.currentGame.replicated.AddPlayer("Matt"+this.count);
        this.count++;
    },
    AddServerPlayer: function(){
        console.log(this.$socket);
        this.CalledFunction( "AddPlayer","Matt"+this.count);
        this.count++;
    },
    CalledFunction: function(name,args){
        console.log("Broadcast up to the server that we called this ",name,args);
        this.$socket.emit(ROOT + "engine call",name,args);
    },
    LeaveGame: function() {
      this.$router.push("/argue");
    },
  },
  sockets: {
    connect: function() {
      console.log("socket connected for room " + this.gameRoom);
      this.connected = true;
      this.$socket.emit(ROOT + "connect");
      this.$socket.emit(ROOT + "sync game", this.gameRoom);
    },
    "Argue:error": function(message, leave) {
      alert(message + leave);
      if (leave != undefined && leave == true) {
        console.log("Leaving game");
        LeaveGame();
      }
    },
    "Argue:set player": function(playerIndex) {
      console.log("Player ID" + playerIndex);
      //TODO do this better
      this.playerID = playerIndex;
    },
    "Argue:engine call": function(source, funcName, argList) {
      console.log("We got a response from the server to call our engine with func " + funcName+" from "+source, argList);
      if (this.$socket.id == source) {
          console.log("Ignoring");
      }
      else this.currentGame.CalledFunction(funcName,argList);
    }
  }
}
</script>

