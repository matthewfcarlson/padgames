<template>
  <div class="404">
    <NavBar />
    <div class="row">
      <!-- TODO move all this into CSS classes -->
      <!-- TODO move to for loop -->

      <div v-for="game in games" :key="game.name" class="col-sm-3 col-xs-6 p-1">
        <router-link tag="div" class="rounded p-2 game-logo" :to="game.url" :style="{ background-color: game.color">
          <img
            :src="game.logo"
            alt="a secret agent that is deciding what to say"
            class="game-logo"
          />
          <span class="text-white">{{game.name}}</span>
        </router-link>
      </div>
    </div>
    <div class="container text-center">
      <div v-for="game in games" :key="game.name">{{ game }}</div>
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
