<template>
  <div class="content">
    <div class="bird-container bird-container--one">
      <div class="bird bird--one"></div>
    </div>

    <div class="bird-container bird-container--two">
      <div class="bird bird--two"></div>
    </div>

    <div class="bird-container bird-container--three">
      <div class="bird bird--three"></div>
    </div>

    <div class="bird-container bird-container--four">
      <div class="bird bird--four"></div>
    </div>
    <svg
      class="editorial"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      viewBox="0 24 150 28"
      preserveAspectRatio="none"
    >
      <defs>
        <path
          id="gentle-wave"
          d="M-160 44c30 0 
        58-18 88-18s
        58 18 88 18 
        58-18 88-18 
        58 18 88 18
        v44h-352z"
        ></path>
      </defs>
      <g class="parallax">
        <!--  D9402E dark red 
                F16838 dark orange
                EA8B31 medium orange
                F19B4D light orange
                F1B955 yellow
        -->
        <use xlink:href="#gentle-wave" x="50" y="0" fill="#F19B4D"></use>
        <use xlink:href="#gentle-wave" x="50" y="2" fill="#EA8B31"></use>
        <use xlink:href="#gentle-wave" x="50" y="4" fill="#F16838"></use>
        <use xlink:href="#gentle-wave" x="50" y="6" fill="#D9402E"></use>
      </g>
    </svg>
    <div class="text-content">
      <div class="container">
        <h1 class>Dixit</h1>
        <h2 v-if="!ready">Connecting</h2>
        <div class="container-fluid">
          <div class="card border">
            <div class="card-header bg-primary text-white">The List of games</div>

            <ul class="list-group list-group-flush">
              <a
                v-for="game in gamesList"
                v-bind:key="game.id"
                class="list-group-item list-group-item-action"
                v-bind:href="/dixit/+game.id"
              >
                {{game.name}}
                <span
                  class="badge badge-pill badge-primary"
                >{{game.numPlayers}} players</span>
              </a>
              <li class="list-group-item" v-if="gamesList.length == 0">No Games Yet</li>
            </ul>
          </div>
          <br>
          <form class="form-inline" onsubmit="event.preventDefault();return false">
            <input
              class="form-control mb-2 mr-sm-2"
              type="text"
              v-model="gameName"
              placeholder="Name of a new game"
            >
            <button class="btn btn-success mb-2" @click="CreateGame">Create Game</button>
          </form>
        </div>
        <hr>
        <br>
        <div class="container-fluid">
          <h2>Dixit is a simple game.</h2>
          <div class="card">
            <div class="card-body">
              <h4 class="card-title">How to play</h4>
              <p class="card-text">
                Each player starts the game with six random cards. Players then take turns being the storyteller.
                The player whose turn it is to be storyteller looks at the six images in his or her hand.
                From one of these, he or she makes up a sentence or phrase that might describe it and says it out loud (without showing the card to the other players).
                Each other player then selects from among their own six cards the one that best matches the sentence given by the storyteller.
                Then, each player gives their selected card to the storyteller, without showing it to the others.
                The storyteller shuffles his or her chosen card with the cards received from the other players, and all cards are then dealt face up.
                The players (except for the storyteller) then secretly guess which picture was the storyteller's, using numbered voting chips.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import VueSocketio from "vue-socket.io";
Vue.use(VueSocketio, window.location.origin);

export default {
  name: "DixitLobby",
  data() {
    return {
      gamesList: [],
      gameName: "",
      ready: false,
      syncTimer:null
    };
  },
  methods: {
    CreateGame() {
      console.log("Creating Dixit game");
      this.$socket.emit("Dixit:create game", this.gameName);
      this.gameName = "";
    },
    ResetIfNotConnected(){
        if (!this.ready) location.reload();
    }
  },
  created: function(){
    //check to make sure we are connected within 3 seconds
    this.syncTimer = setTimeout(this.ResetIfNotConnected,3000);
  },
  sockets: {
    connect: function() {
      console.log("socket connected");
      this.$socket.emit("Dixit:connect");
      this.$socket.emit("Dixit:list games");
    },
    "Dixit:connected": function() {
      console.log("We connected");
      this.ready = true;
      this.$socket.emit("Dixit:list games");
    },
    "Dixit:list games": function(newGames) {
      console.log("We got a new list of Dixit games", newGames);
      this.$set(this, "gamesList", newGames);
    }
  }
};
</script>
<style>
@font-face {
  font-family: DixitFont;
  src: url("/static/dixit/dixit.ttf");
}
#app {
  min-height: 100vh;
}
</style>
<style scoped>
.parallax > use {
  animation: move-forever 16s linear infinite;
}
.parallax :nth-child(1) {
  animation-delay: -2s;
}
.parallax :nth-child(2) {
  animation-delay: -2s;
  animation-duration: 10s;
}
.parallax :nth-child(3) {
  animation-delay: -4s;
  animation-duration: 7s;
}
.parallax :nth-child(4) {
  animation-delay: -5s;
  animation-duration: 5s;
}

@keyframes move-forever {
  0% {
    transform: translate(-90px, 0%);
  }
  100% {
    transform: translate(85px, 0%);
  }
}

.editorial {
  display: block;
  width: 100%;
  height: 10em;
  max-height: 100vh;
  margin: 0;
}

.content {
  background-color: #f3cd5d;
  margin: 0;
  min-height: 100vh;
  overflow: hidden;
  padding: 9em 0 0 0;
  position:relative;
}

.text-content {
  font-family: "Lato", sans-serif;
  background-color: #d64130;
  min-height: 75vh;
  margin: -0.1em 0 0 0;
  padding: 1em;
  color: #222;
  font-weight: 300;
}
.text-content h1 {
  margin-top: -1.3em;
  font-weight: 100;
  font-size: 12em;
  user-select: none;
  cursor: default;
  text-align: center;
  color: #463e49; /*#26171A;*/
  -webkit-text-stroke-width: 2pt;
  text-shadow: 3px 3px 10px #000;
  -webkit-text-stroke-color: #f1b955;
  outline: none;
  font-family: DixitFont;
}

/*prevent many large-by-comparison ripples by shrinking the height*/
@media (max-width: 50em) {
  .content h1 {
    font-size: 16vmax;
  }
  .editorial {
    height: 17vw;
  }
}

.bird {
  background-image: url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/174479/bird-cells.svg);
  background-size: auto 100%;
  width: 80px;
  height: 125px;
  will-change: background-position;
  -webkit-animation-name: fly-cycle;
  overflow: hidden;
  animation-name: fly-cycle;
  -webkit-animation-timing-function: steps(10);
  animation-timing-function: steps(10);
  -webkit-animation-iteration-count: infinite;
  animation-iteration-count: infinite;
}
.bird--one {
  -webkit-animation-duration: 1s;
  animation-duration: 1s;
  -webkit-animation-delay: -0.5s;
  animation-delay: -0.5s;
}
.bird--two {
  -webkit-animation-duration: 0.9s;
  animation-duration: 0.9s;
  -webkit-animation-delay: -0.75s;
  animation-delay: -0.75s;
}
.bird--three {
  -webkit-animation-duration: 1.25s;
  animation-duration: 1.25s;
  -webkit-animation-delay: -0.25s;
  animation-delay: -0.25s;
}
.bird--four {
  -webkit-animation-duration: 1.1s;
  animation-duration: 1.1s;
  -webkit-animation-delay: -0.5s;
  animation-delay: -0.5s;
}

.bird-container {
  position: absolute;
  top: 0%;
  left: -10%;
  -webkit-transform: scale(0) translateX(-10vw);
  transform: scale(0) translateX(-10vw);
  will-change: transform;
  -webkit-animation-name: fly-right-one;
  animation-name: fly-right-one;
  -webkit-animation-timing-function: linear;
  animation-timing-function: linear;
  -webkit-animation-iteration-count: infinite;
  animation-iteration-count: infinite;
}
.bird-container--one {
  -webkit-animation-duration: 15s;
  animation-duration: 15s;
  -webkit-animation-delay: 0;
  animation-delay: 0;
}
.bird-container--two {
  -webkit-animation-duration: 16s;
  animation-duration: 16s;
  -webkit-animation-delay: 1s;
  animation-delay: 1s;
  -webkit-animation-name: fly-right-two;
  animation-name: fly-right-two;
}
.bird-container--three {
  -webkit-animation-duration: 14.6s;
  animation-duration: 14.6s;
  -webkit-animation-delay: 9.5s;
  animation-delay: 9.5s;
}
.bird-container--four {
  -webkit-animation-duration: 16s;
  animation-duration: 16s;
  -webkit-animation-delay: 10.25s;
  animation-delay: 10.25s;
  -webkit-animation-name: fly-right-two;
  animation-name: fly-right-two;
}

@-webkit-keyframes fly-cycle {
  100% {
    background-position: -900px 0;
  }
}

@keyframes fly-cycle {
  100% {
    background-position: -900px 0;
  }
}
@-webkit-keyframes fly-right-one {
  0% {
    -webkit-transform: scale(0.3) translateX(-10vw);
    transform: scale(0.3) translateX(-10vw);
  }
  10% {
    -webkit-transform: translateY(2vh) translateX(10vw) scale(0.4);
    transform: translateY(2vh) translateX(10vw) scale(0.4);
  }
  20% {
    -webkit-transform: translateY(0vh) translateX(30vw) scale(0.5);
    transform: translateY(0vh) translateX(30vw) scale(0.5);
  }
  30% {
    -webkit-transform: translateY(4vh) translateX(50vw) scale(0.6);
    transform: translateY(4vh) translateX(50vw) scale(0.6);
  }
  40% {
    -webkit-transform: translateY(2vh) translateX(70vw) scale(0.6);
    transform: translateY(2vh) translateX(70vw) scale(0.6);
  }
  50% {
    -webkit-transform: translateY(0vh) translateX(90vw) scale(0.6);
    transform: translateY(0vh) translateX(90vw) scale(0.6);
  }
  60% {
    -webkit-transform: translateY(0vh) translateX(110vw) scale(0.6);
    transform: translateY(0vh) translateX(110vw) scale(0.6);
  }
  100% {
    -webkit-transform: translateY(0vh) translateX(110vw) scale(0.6);
    transform: translateY(0vh) translateX(110vw) scale(0.6);
  }
}
@keyframes fly-right-one {
  0% {
    -webkit-transform: scale(0.3) translateX(-10vw);
    transform: scale(0.3) translateX(-10vw);
  }
  10% {
    -webkit-transform: translateY(2vh) translateX(10vw) scale(0.4);
    transform: translateY(2vh) translateX(10vw) scale(0.4);
  }
  20% {
    -webkit-transform: translateY(0vh) translateX(30vw) scale(0.5);
    transform: translateY(0vh) translateX(30vw) scale(0.5);
  }
  30% {
    -webkit-transform: translateY(4vh) translateX(50vw) scale(0.6);
    transform: translateY(4vh) translateX(50vw) scale(0.6);
  }
  40% {
    -webkit-transform: translateY(2vh) translateX(70vw) scale(0.6);
    transform: translateY(2vh) translateX(70vw) scale(0.6);
  }
  50% {
    -webkit-transform: translateY(0vh) translateX(90vw) scale(0.6);
    transform: translateY(0vh) translateX(90vw) scale(0.6);
  }
  60% {
    -webkit-transform: translateY(0vh) translateX(110vw) scale(0.6);
    transform: translateY(0vh) translateX(110vw) scale(0.6);
  }
  100% {
    -webkit-transform: translateY(0vh) translateX(110vw) scale(0.6);
    transform: translateY(0vh) translateX(110vw) scale(0.6);
  }
}
@-webkit-keyframes fly-right-two {
  0% {
    -webkit-transform: translateY(-2vh) translateX(-10vw) scale(0.5);
    transform: translateY(-2vh) translateX(-10vw) scale(0.5);
  }
  10% {
    -webkit-transform: translateY(0vh) translateX(10vw) scale(0.4);
    transform: translateY(0vh) translateX(10vw) scale(0.4);
  }
  20% {
    -webkit-transform: translateY(-4vh) translateX(30vw) scale(0.6);
    transform: translateY(-4vh) translateX(30vw) scale(0.6);
  }
  30% {
    -webkit-transform: translateY(1vh) translateX(50vw) scale(0.45);
    transform: translateY(1vh) translateX(50vw) scale(0.45);
  }
  40% {
    -webkit-transform: translateY(-2.5vh) translateX(70vw) scale(0.5);
    transform: translateY(-2.5vh) translateX(70vw) scale(0.5);
  }
  50% {
    -webkit-transform: translateY(0vh) translateX(90vw) scale(0.45);
    transform: translateY(0vh) translateX(90vw) scale(0.45);
  }
  60% {
    -webkit-transform: translateY(0vh) translateX(110vw) scale(0.45);
    transform: translateY(0vh) translateX(110vw) scale(0.45);
  }
  100% {
    -webkit-transform: translateY(0vh) translateX(110vw) scale(0.45);
    transform: translateY(0vh) translateX(110vw) scale(0.45);
  }
}
@keyframes fly-right-two {
  0% {
    -webkit-transform: translateY(-2vh) translateX(-10vw) scale(0.5);
    transform: translateY(-2vh) translateX(-10vw) scale(0.5);
  }
  10% {
    -webkit-transform: translateY(0vh) translateX(10vw) scale(0.4);
    transform: translateY(0vh) translateX(10vw) scale(0.4);
  }
  20% {
    -webkit-transform: translateY(-4vh) translateX(30vw) scale(0.6);
    transform: translateY(-4vh) translateX(30vw) scale(0.6);
  }
  30% {
    -webkit-transform: translateY(1vh) translateX(50vw) scale(0.45);
    transform: translateY(1vh) translateX(50vw) scale(0.45);
  }
  40% {
    -webkit-transform: translateY(-2.5vh) translateX(70vw) scale(0.5);
    transform: translateY(-2.5vh) translateX(70vw) scale(0.5);
  }
  50% {
    -webkit-transform: translateY(0vh) translateX(90vw) scale(0.45);
    transform: translateY(0vh) translateX(90vw) scale(0.45);
  }
  60% {
    -webkit-transform: translateY(0vh) translateX(110vw) scale(0.45);
    transform: translateY(0vh) translateX(110vw) scale(0.45);
  }
  100% {
    -webkit-transform: translateY(0vh) translateX(110vw) scale(0.45);
    transform: translateY(0vh) translateX(110vw) scale(0.45);
  }
}
</style>