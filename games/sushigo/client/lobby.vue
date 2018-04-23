<template>
<div class="content">
    <h1>Sushi Go!</h1>
    <div>
        Here's where the lobby will go
        <a v-bind:href="/sushi/+game.id" v-for="game in gamesList">{{game.name}}</a>
    </div>
    
    <button class="btn btn-success" @click="CreateGame">Create Game</button>
</div>
</template>
<script>
import Vue from "vue";
import VueSocketio from "vue-socket.io";
Vue.use(VueSocketio, window.location.origin);

export default {
  name: "Sushies",
  data() {
    return {
      gamesList: {},
      playerName: "Testing",
    };
  },
  methods: {
    CreateGame(){
      console.log("Crating sushi game");
      this.$socket.emit("create sushi game", this.playerName+"'s game");
    }
  },
  sockets: {
    connect: function() {
      console.log("socket connected");
      this.$socket.emit("list sushi games");
    },
    "list sushi games": function(newGames) {
      console.log("We got a new list of sushi games", newGames);      
      this.$set(this, "gamesList", newGames);
    },
  }
};
</script>

<style scoped>
</style>