<template>
<div class="content">
    <h1 class="speech-bubble">Arguable</h1>
    <h2 v-if="!ready">Connecting</h2>
    <div class="container-fluid" v-else>
      <div class="card border">
        <div class="card-header bg-primary text-white">
          The List of games
        </div>
          
        <ul class="list-group list-group-flush">
          <a v-for="game in gamesList" v-bind:key="game.id" class="list-group-item list-group-item-action" v-bind:href="/argue/+game.id" >{{game.name}}</a>
          <li class="list-group-item" v-if="gamesList.length == 0">No Games Yet</li>
        </ul>
          
      </div>
      <br/>
      <form class="form-inline" onsubmit="event.preventDefault();return false">
        <input class="form-control mb-2 mr-sm-2" type="text" v-model="gameName" placeholder="Name of a new game"/>
        <button class="btn btn-success mb-2" @click="CreateGame">Create Game</button>
      </form>

      <hr/>
      
      <p class="speech-bubble">Think you can win any argument?</p>
      <p class="speech-bubble">Regardless of what you argue for?</p>
      <p>A seriously silly party game for funny people.</p>

      <h3 class="speech-bubble">How To play</h3>

      <p>The game starts by randomly selecting a moderator. In this example, Ellen is the moderator. The moderator first picks out of 5 different topics to debate and then selects the two players she wants to debate. </p>
      <p>Ellen then picks who will say yes and no to the issue. She gives TJ the YES card and Kira the NO card.</p>
      <p>Kira and TJ then both get two debate strategies. In this example, Kira will argue that men should be allowed to vote and TJ will argue they will not. Kira will have the strategies: be really polite, and hurl insults mercilessly. </p>
      <p>TJ will argue with his strategies of blaming the vadican and wheezing</p>
      <p>Ellen moderates the argument and asks questions to both debaters. The debate will last 2 minutes and when the debate is over, the audience will vote. In this case, TJ wins. Kira recieves an under pressure and TJ is safe. If she gets another under pressure, she is out of the game</p>
      <p>After a player is out, they continue to play by voting on the debates.</p>
      <p>Eventually only one player will be left and they are crowned the debate winner.</p>
    </div>
    
  

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
      ready: false
    };
  },
  methods: {
    CreateGame() {
      console.log("Creating Argue game");
      this.$socket.emit("Argue:create game", this.gameName);
      this.gameName = "";
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
  color:white;
  padding:0.75em;
  text-transform: uppercase;
  margin:0.5em;
	border-radius: .2em;
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
  border-right-color: var(--color4);
	border-left: 0;
	border-bottom: 0;
	margin-top: -10px;
	margin-left: -20px;
}
</style>