<template>
<div class="content">
    <h1>Arguable Game</h1>
    <div v-if="playerIndex == -1">
      <input type="text" class="form-control" placeholder="Your name" v-model="playerName" />
      
      <button @click="JoinGame()">Join Game</button>
    </div>
    <button v-else-if="state=='lobby'" @click="StartGame">Start Game</button>
   
    <div is="ModeratorPickDebator" v-else-if="isModerator && state == 'first_mod'"></div>
    <div is="ModeratorTopicPick" v-else-if="isModerator && state == 'moderate_topic'"></div>
    <div v-else>
      Waiting...
    </div>

    <pre>
       {{playerList}}
      {{state}}
      Role: {{currentRole}}
      Moderator: {{moderator}}
      PlayerIndex: {{playerIndex}}
    </pre>
    
</div>
</template>

<script>
import Vue from "vue";
import VueSocketio from "vue-socket.io";
import ArgueGame  from "../common/argueGame";
import ModeratorTopicPick  from "./ModeratorTopicPick";
import ModeratorPickDebator  from "./ModeratorPickDebator";

Vue.use(VueSocketio, window.location.origin);
const ROOT = "Argue:";
export default {
  name: "Arguable",
  data() {
    return {
        currentGame: null,
        count:0,
        playerIndex: -1,
        playerName: "Default",
    }
  },
  components: {
    ModeratorPickDebator,
    ModeratorTopicPick
  },
  created: function() {
    this.gameRoom = this.$route.params.gameID || "";
  },
  computed: {
    playerList: function(){
      if (this.currentGame == null) return [];
      return this.currentGame.GetPlayers();
    },
    state: function(){
      if (this.currentGame == null) return [];
      return this.currentGame.GetState();
    },
    moderator: function(){
      if (this.currentGame == null) return [];
      return this.currentGame.Moderator();
    },
    isModerator: function(){
      if (this.currentGame == null) return [];
      return this.currentGame.Moderator() == this.playerIndex;
    },
    currentRole: function(){
      if (this.currentGame == null) return "none";
      if (this.playerIndex == -1) return "spectator";
      if (this.currentGame.Moderator() == this.playerIndex) return "moderator";
      if (this.currentGame.GetYesDebator() == this.playerIndex) return "debate_yes";
      if (this.currentGame.GetNoDebator() == this.playerIndex) return "debate_no";
      return "voter";
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
      this.$socket.emit(ROOT + "join game", gameRoom, playerName);
    },
    RejoinGame: function(gameRoom, playerName, playerIndex, socketId) {
      console.log("Attempting to rejoin the game!");
      this.$socket.emit(ROOT + "rejoin game", gameRoom, playerName, playerIndex, socketId);      
    },
    LeaveGame: function() {
      this.$router.push("/argue");
    },
  },
  sockets: {
    connect: function() {
      var gameRoom = this.gameRoom;
      console.log("socket connected for room " + gameRoom);
      this.connected = true;
      this.$socket.emit(ROOT + "connect");
      this.$socket.emit(ROOT + "sync game", gameRoom);
      var self = this;
      const game = ArgueGame.CreateGame(gameRoom, function(name,args){
          console.log("Broadcast up to the server that we called this ",name,args);
          self.$socket.emit(ROOT + "engine call",gameRoom, name,args);
      });
      this.currentGame = game;

      var previousGame = null;
      if (localStorage.getItem(gameRoom) && this.playerIndex == -1) {
        previousGame = JSON.parse(localStorage.getItem(gameRoom));
        console.log(this);
        this.RejoinGame(gameRoom,previousGame.playerName, previousGame.index, previousGame.socketId);
        localStorage.removeItem(gameRoom);
      }
      console.log("Previous game",previousGame);
    },
    "Argue:error": function(message,leave) {
      alert(message + leave);
      if (leave != undefined && leave == true) {
        console.log("Leaving game");
        LeaveGame();
      }
    },
    "Argue:set player": function(playerIndex) {
      console.log("Player ID" + playerIndex);
      //TODO do this better
      this.playerIndex = playerIndex;
      localStorage.setItem(this.gameRoom,JSON.stringify({playerName:this.playerName,index:this.playerIndex, socketId:this.$socket.id}));
      
    },
    "Argue:engine call": function(data) {
      console.log("We got a response from the server to call our engine with func " + data.funcName+" from "+data.source, data);
      if (this.$socket.id == data.source) {
          console.log("Ignoring");
      }
      else this.currentGame.CallFunc(data.funcName,data.argList);
    }
  }
}
</script>

