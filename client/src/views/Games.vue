<template>
  <div class="404">
    <NavBar />
    <div class="games container">
      <!-- TODO move all this into CSS classes -->
      <div v-for="game in games" :key="game.name" class="card mb-2">
        <div class="row no-gutters">
          <router-link
            tag="div"
            :to="game.url"
            class="col-md-4"
            v-bind:style="{ backgroundColor: game.color}"
          >
            <img :src="game.logo" :alt="'game logo for the game ' + game.name" class="card-img" />
          </router-link>
          <div class="col-md-8">
            <div class="card-body">
              <h5 class="card-title">
                {{game.name}}
                <span class="small text-muted" v-if="!game.ready">Coming soon</span>
              </h5>
              <p class="card-text">{{ game.description }}</p>
              <p class="card-text" v-if="game.author">Made by {{ game.author }}</p>
              <p class="card-text">
                <router-link :to="game.url" class="btn btn-info">More Info</router-link>
                <router-link
                  v-if="game.ready"
                  :to="'/host/'+game.id"
                  class="btn btn-success"
                >Start a Game</router-link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <hr />
    <div class="suggest">
      <h2>Suggesting a game</h2>
      <p>
        <span>If you want to suggest a game, I'd be happy to chat.</span>
        <router-link to="contact">Reach out</router-link>and I'll add it to the list of game ideas, or put up a PR
        <a
          href="https://github.com/matthewfcarlson/padgames/pulls"
        >up on Github and I'll review it!</a>. I'll make sure you get the credit you deserve!
      </p>
      <router-link to="contact" class="btn btn-success mb-3">Suggest a game</router-link>
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

