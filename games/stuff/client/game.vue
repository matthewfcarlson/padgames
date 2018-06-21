<template>
<div class="content">
   <div class="container-fluid" v-if="playerID == -1">
      <h2>Game of Stuff!</h2>
      <hr/>
      <h3>Please Input Your Name</h3>
      <input type="text" class="form-control" placeholder="Your name" v-model="playerName" />
      <button @click="JoinGame()" class="btn btn-success btn-block">Join Game</button>
      <br/>
      <button @click="LeaveGame" class="btn btn-danger">Leave Game</button>    
    </div>
</div>
</template>
<script>
import Vue from "vue";
import VueSocketio from "vue-socket.io";
Vue.use(VueSocketio, window.location.origin);
const ROOT = "stuff:";
export default {
  name: "Stuff",
  data() {
    return {
      gameRoom: "",
      connected: false,
      pickedCard: [],
      playerID: -1,
      gameName: "",
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
    }
  },
  created: function() {
    this.gameRoom = this.$route.params.gameID || "";
  },
  sockets: {
    connect: function() {
      console.log("socket connected");
      this.connected = true;
      this.$socket.emit(ROOT + "sync game", this.gameRoom);
    },
     "stuff:error": function(message) {
      alert(message);
    },
     "stuff:sync game": function(newgame) {
      console.log(newgame);
      //TODO do this better
      this.game = newgame;
    },
  }
};
</script>

<style scoped>
</style>