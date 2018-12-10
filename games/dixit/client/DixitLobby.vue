<template>
  <div class="content">
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
              >{{game.name}} <span class="badge badge-pill badge-primary">{{game.numPlayers}} players</span></a>
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
      ready: false
    };
  },
  methods: {
    CreateGame() {
      console.log("Creating Dixit game");
      this.$socket.emit("Dixit:create game", this.gameName);
      this.gameName = "";
    }
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
</style>