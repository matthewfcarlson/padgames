<template>
<div class="content">
    <h1 class="speech-bubble">Arguable</h1>
    <div class="card">
      <div class="card-header">
        The List of games
      </div>
        
      <ul class="list-group list-group-flush">
        <a v-for="game in gamesList" class="list-group-item list-group-item-action" v-bind:href="/argue/+game.id" >{{game.name}}</a>
          <li v-if="gamesList.length == 0">No Games Yet</li>
      </ul>
        
    </div>
    <input type="text" v-model="gameName" placeholder="Name of a new game"/>
    <button class="btn btn-success" @click="CreateGame">Create Game</button>
    <div v-if="!ready">Connecting</div>
  <hr/>
  <h3>How To play</h3>

</div>
</template>
<script>
import Vue from "vue";
import VueSocketio from "vue-socket.io";
Vue.use(VueSocketio, window.location.origin);

export default {
  name: "Argue",
  data() {
    return {
      gamesList: [],
      gameName: "",
      playerName: "Testing",
      ready: false
    };
  },
  methods: {
    CreateGame() {
      console.log("Creating Argue game");
      this.$socket.emit("Argue:create game", this.gameName);
    }
  },
  sockets: {
    connect: function() {
      console.log("socket connected");
      this.$socket.emit("Argue:connect");
      this.$socket.emit("Argue:list games");
    },
    "Argue:connected": function(){
      console.log("We connected");
      this.ready = true;
      this.$socket.emit("Argue:list games");
    },
    "Argue:list games": function(newGames) {
      console.log("We got a new list of Argue games", newGames);
      this.$set(this, "gamesList", newGames);
    }
  }
};
</script>
<style>
:root {


--color1: #F9F4CA; /* beige*/
--color2: #B9B696; /* khaki */
--color3: #797763; /*navajowhite */
--color4: #3A392F;
--color5: #DFDBB5; /* palegoldenrod */
--color6: blanchedalmond /* blanched almond*/
}
</style>
<style scoped>
.content{  /* https://bennettfeely.com/gradients/ */
  background:var(--color1);
  background: -moz-linear-gradient(top,var(--color1) 0%, var(--color5) 100%);
  background: -webkit-gradient(left top, left bottom, color-stop(0%,var(--color5)), color-stop(100%, var(--color5)));
  background: -webkit-linear-gradient(top,var(--color1) 0%, var(--color5) 100%);
  background: -o-linear-gradient(top,var(--color1) 0%, var(--color5) 100%);
  background: -ms-linear-gradient(top,var(--color1) 0%, var(--color5) 100%);
  background: linear-gradient(to bottom,var(--color1) 0%, var(--color5) 100%);
  filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#f85032', endColorstr='#273de6', GradientType=0 );
  
  /* Set rules to fill background */
  min-height: 100%;
  min-width: 100%;
	
  /* Set up proportionate scaling */
  width: 100%;
  height: auto;
	
  /* Set up positioning */
  position: fixed;
  top: 0;
  left: 0;
}

.speech-bubble {
	position: relative;
	background: var(--color4);
  color:#eee;
  padding:0.75em;
  margin:0.42em;
	border-radius: .4em;
}
.speech-bubble:after {
	content: '';
	position: absolute;
	left: 0;
	top: 50%;
	width: 0;
	height: 0;
	border: 20px solid transparent;
	border-right-color: #000000;
	border-left: 0;
	border-bottom: 0;
	margin-top: -10px;
	margin-left: -20px;
}
</style>