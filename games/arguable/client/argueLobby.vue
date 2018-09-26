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
          <a v-for="game in gamesList" class="list-group-item list-group-item-action" v-bind:href="/argue/+game.id" >{{game.name}}</a>
          <li class="list-group-item" v-if="gamesList.length == 0">No Games Yet</li>
        </ul>
          
      </div>
      <br/>
      <form class="form-inline">
        <input class="form-control mb-2 mr-sm-2" type="text" v-model="gameName" placeholder="Name of a new game"/>
        <button class="btn btn-success mb-2" @click="CreateGame">Create Game</button>
      </form>

      <hr/>
      <h3>How To play</h3>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec interdum vel magna id pellentesque. Pellentesque tortor sapien, viverra non feugiat quis, iaculis in velit. Vestibulum sed nulla ut nunc porta egestas. Curabitur et semper ante, in porta eros. Phasellus tincidunt molestie mi, in commodo massa viverra ut. Etiam at odio leo. Aliquam maximus egestas scelerisque. Phasellus enim mi, pretium in efficitur ac, dictum hendrerit ipsum. Praesent sodales feugiat libero.</p>

      <p>Vestibulum maximus mollis euismod. In venenatis vel metus nec finibus. Duis in sapien a nisl auctor aliquam. Proin lacus lacus, sagittis eget auctor id, lacinia ut est. Vivamus vel suscipit ligula. Nunc faucibus pretium justo ut malesuada. Nulla malesuada diam non urna malesuada laoreet. Nulla ullamcorper risus sit amet laoreet blandit. Integer ullamcorper nibh enim, ut eleifend augue consectetur ac. Fusce eget commodo arcu, ac posuere sapien. Vestibulum vitae tincidunt arcu. Quisque ligula augue, euismod eu enim sed, pulvinar iaculis sapien. Donec mauris libero, consequat ac venenatis ac, fringilla a leo. Phasellus hendrerit orci orci, et volutpat lacus imperdiet ac. Vestibulum ac tincidunt odio, eget sollicitudin lacus. Nam augue ligula, feugiat sed accumsan pretium, suscipit et ex.</p>

      <p>Proin dignissim in turpis sed ornare. Donec ut ex auctor, facilisis urna at, maximus augue. Sed scelerisque, odio vitae cursus vestibulum, nisl turpis ullamcorper velit, sit amet porta ipsum mi non arcu. Praesent luctus efficitur hendrerit. Nulla id erat sagittis, dignissim diam eu, ultricies neque. Sed vitae augue ex. Sed placerat purus purus, semper ullamcorper leo eleifend non. Nulla leo odio, commodo eget congue ut, ultricies sollicitudin elit. Duis sem velit, accumsan vel elit sit amet, venenatis mattis mi. Curabitur eu pellentesque velit. Duis vitae vestibulum est, vitae tincidunt sapien. Morbi mauris ante, maximus eget egestas faucibus, aliquam sit amet sapien. Etiam luctus consectetur auctor. Aenean eu fringilla metus, in posuere turpis. Nam eget augue risus.</p>

      <p>Quisque eu ante a felis congue condimentum at at lectus. Etiam enim sem, mattis vitae lacus at, dictum ullamcorper metus. Ut gravida elit id erat placerat convallis. Duis sollicitudin vehicula orci ut maximus. In ornare urna nec lorem gravida, at pretium tortor mattis. Morbi tempus pretium ante at efficitur. In hac habitasse platea dictumst. Nulla bibendum sodales vulputate. Fusce porta dapibus nisi, sed egestas velit rutrum molestie. Nam vel feugiat nibh. In nisi nisi, consequat varius eleifend nec, pellentesque nec magna. Donec mauris sem, egestas in rhoncus eget, imperdiet quis lectus. Nunc gravida iaculis nulla sit amet cursus. Aliquam semper facilisis urna, consectetur dapibus arcu tristique sit amet. Integer porta enim est, sit amet scelerisque massa sollicitudin a. Vestibulum eget lectus rutrum mi sagittis tincidunt vitae sed purus.</p>

      <p>Maecenas in sodales quam, in venenatis purus. Proin quis nulla pretium, venenatis metus nec, facilisis purus. Etiam in vestibulum nisl. Etiam sed dapibus purus. Nunc scelerisque eu massa et euismod. Integer at quam augue. In hendrerit euismod dignissim. Duis id nisi nec felis porttitor elementum eget eget tortor. Nulla dictum suscipit leo vitae cursus. Morbi venenatis augue non justo lobortis, et gravida quam semper. Vestibulum vitae consectetur lectus. Proin eget lectus lorem.</p>
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