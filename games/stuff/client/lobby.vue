<template>
<div class="content">
    <h1>Game of Stuff</h1>
    <div>
        The List of games
        <ul>
          <li v-for="game in gamesList"><a v-bind:href="/stuff/+game.id" >{{game.name}}</a></li>
          <li v-if="gamesList.length == 0">No Games Yet</li>
        </ul>
        
    </div>
    <input type="text" v-model="gameName" placeholder="Name of a new game"/>
    <button class="btn btn-success" @click="CreateGame">Create Game</button>
</div>
</template>
<script>
import Vue from "vue";
import VueSocketio from "vue-socket.io";
Vue.use(VueSocketio, window.location.origin);

export default {
  name: "Stuff",
  data() {
    return {
      gamesList: [],
      gameName: "",
      playerName: "Testing"
    };
  },
  methods: {
    CreateGame() {
      console.log("Crating stuff game");
      this.$socket.emit("stuff:create game", this.gameName);
    }
  },  
  sockets: {
    connect: function() {
      console.log("socket connected");
      this.$socket.emit("stuff:connect");
      this.$socket.emit("stuff:list games");
    },
    "stuff:list games": function(newGames) {
      console.log("We got a new list of stuff games", newGames);
      this.$set(this, "gamesList", newGames);
    }
  }
};
</script>

<style scoped>

</style>