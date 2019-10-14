<template>
  <div class="404">
    <NavBar />
    <div class="games">
      <!-- TODO move all this into CSS classes -->
      <div v-for="game in games" :key="game.name" class="card">
        <div class="row no-gutters">
          <router-link tag="div" :to="game.url" class="col-md-4" v-bind:style="{ backgroundColor: game.color}">
            <img :src="game.logo" :alt="'game logo for the game ' + game.name" class="card-img" />
          </router-link>
          <div class="col-md-8">
            <div class="card-body">
              <h5 class="card-title">{{game.name}}</h5>
              <p
                class="card-text"
              >{{ game.description }}</p>
              <p class="card-text">
                <router-link :to="game.url" class="btn btn-info">More Info</router-link>
                <router-link :to="'/host/'+game.id" class="btn btn-success">Start a Game</router-link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import NavBar from "../components/NavBar.vue"; // @ is an alias to /src
import Footer from "../components/Footer.vue";
import NewsLetter from "../components/NewsLetter.vue";
import { AllGames } from "../routes.dynamic";

@Component({
  components: {
    NavBar,
    Footer,
    NewsLetter
  }
})
export default class Games extends Vue {
  games = AllGames;
}
</script>


<style scoped lang="css">
.game-logo {
  min-height: 200px;
  position: relative;
  overflow: hidden;
  cursor: pointer;
}
.game-logo > img {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  height: 100%;
}
.game-logo > span {
  position: absolute;
  bottom: 0;
  font-size: 1.5em;
}
</style>

