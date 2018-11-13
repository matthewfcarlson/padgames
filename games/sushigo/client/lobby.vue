<template>
<div class="content">
    <h1>Sushi Go!</h1>
    <div>
        The List of games
        <ul>
          <li v-for="game in gamesList"><a v-bind:href="/sushi/+game.id" >{{game.name}}</a></li>
          <li v-if="gamesList.length == 0">No Games Yet</li>
        </ul>
        
    </div>
    <input type="text" v-model="gameName" placeholder="Name of a new game"/>
    <label><input type="checkbox" v-model="extended"/> Play with extended deck</label>
    <button class="btn btn-success" @click="CreateGame">Create Game</button>
    <hr>
    <h2>How to Play</h2>
    <p>In the super-fast sushi card game Sushi Go!, you are eating at a sushi restaurant and trying to grab the best combination of sushi dishes as they whiz by. Score points for collecting the most sushi rolls or making a full set of sashimi. Dip your favorite nigiri in wasabi to triple its value! And once you've eaten it all, finish your meal with all the pudding you've got! But be careful which sushi you allow your friends to take; it might be just what they need to beat you!</p>

    <p>Sushi Go! takes the dynamics of "draft and pass", while keeping the rules to a minimum. As you see the first few hands of cards, you must quickly assess the make-up of the round and decide which type of sushi you'll go for. Then, each turn you'll need to weigh which cards to keep and which to pass on. The different scoring combinations allow for some clever plays and nasty blocks. Round to round, you must also keep your eye on the goal of having the most pudding cards at the end of the game!</p>
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
      extended: false,
      playerName: "Testing"
    };
  },
  methods: {
    CreateGame() {
      console.log("Crating sushi game");
      this.$socket.emit("create sushi game", this.gameName);
    }
  },
  created: function() {
    this.$socket.emit("list sushi games");
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