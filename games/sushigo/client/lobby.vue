<template>
<div class="content">
    <h1>Sushi Go!</h1>
    <div>
        The List of games
        <ul>
          <li v-for="game in gamesList"><a v-bind:href="/sushi/+game.id" >{{game.name}}</a></li>
        </ul>
        <div v-if="gameList.length == 0">No Games Yet</div>
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
  name: "Sushies",
  data() {
    return {
      gamesList: [],
      gameName: "",
      playerName: "Testing"
    };
  },
  methods: {
    CreateGame() {
      console.log("Crating sushi game");
      this.$socket.emit("create sushi game", this.gameName);
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
    }
  }
};
</script>

<style scoped>

</style>