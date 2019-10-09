<template>
  <div class="404">
    <NavBar />
    <div class="container text-center">
      <div v-for="game in games" :key="game.name">
        {{ game }}
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
