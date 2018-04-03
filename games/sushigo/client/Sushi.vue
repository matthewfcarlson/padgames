<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <pre>{{game}}</pre>

    <button @click="StartGame">StartGame</button>
    <button @click="game.AddPlayer('testing')">AddPlayer</button>
    <button @click="PlayAll">PlayAll</button>
    <button @click="game.SetAsideCard(0,0)">GetFirstCard P1</button>    
    <button @click="game.SetAsideCard(1,0)">GetFirstCard P2</button>
    <button @click="game.SetAsideCard(2,0)">GetFirstCard P3</button>
    
    
  </div>
</template>

<script>
import { Game } from "../common/game";
import Vue from "vue";
import VueSocketio from "vue-socket.io";
Vue.use(VueSocketio,window.location.origin);
console.log("Connecting to "+window.location.origin);
export default {
  name: "Sushies",
  data() {
    return {
      isPhone: window.innerWidth <= 667,
      msg: "Sushi on the go",
      game: new Game()
    };
  },
  methods: {
    PlayAll: function() {
      for (var i = 0; i < this.game.players.length; i++) {
        this.game.SetAsideCard(i, 0);
      }
    }, 
    StartGame: function(){
      this.$socket.emit('start sushi game');
    }
  },
  
  sockets: {
    connect: function() {
      console.log("socket connected");
      this.$socket.emit('join sushi game', "Test Player"+Math.floor(Math.random()*10));
    },
    "set players": function(newPlayer) {
      this.$set(this.game,"players",newPlayer);
    },
    "start game": function() {
      this.game.StartGame();
    },
    "reset game": function() {
      this.game = new Game(); //might need a vue.set here
    },
    "set deck seed": function(seed){
      this.game.deckSeed = seed;
    },
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1,
h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
