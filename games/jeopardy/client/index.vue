<template>
  <div class="Jeopardy">
    <NavBar />
    <div class="escape-gutters py-5" :style="{backgroundColor: color}">
      <div class="container">
        <div class="row">
          <div class="col">
            <img
              src="./assets/logo.svg"
              alt="game logo for the game"
              class="game-logo mx-auto d-block"
            />
          </div>
          <div class="col">
            <h1>Jeopardy</h1>
            <p>A game</p>
            <p>TODO: tutorial here?</p>
            <router-link
              tag="button"
              to="/host/Jeopardy"
              class="btn btn-success btn-block"
            >Start a Game</router-link>
          </div>
        </div>
      </div>
    </div>
    <div class="container">
      <h2>Watch a family play Jeopardy together</h2>
      <p>Video goes here </p>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

import NavBar from "Client/components/NavBar.vue"; // @ is an alias to /src
import Footer from "Client/components/Footer.vue";

@Component({
  components: {
    NavBar,
    Footer
  }
})
export default class Jeopardy extends Vue {
  @Prop({ default: "#060CE9" }) color!: string;
}
</script>
