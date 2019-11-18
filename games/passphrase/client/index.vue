<template>
  <div class="passphrase">
    <NavBar />
    <div class="escape-gutters py-5" :style="{backgroundColor: color}">
      <div class="container">
        <div class="row">
          <div class="col">
            <img
              src="./assets/passphrase_logo.svg"
              alt="game logo for the game"
              class="game-logo mx-auto d-block"
            />
          </div>
          <div class="col">
            <h1>PassPhrase</h1>
            <p>A game</p>
            <p>TODO: tutorial here?</p>
            <router-link
              tag="button"
              to="/host/passphrase"
              class="btn btn-success btn-block"
            >Start a Game</router-link>
          </div>
        </div>
      </div>
    </div>
    <div class="container">
      <h2>Watch a family play PassPhrase together</h2>
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
export default class PassPhrase extends Vue {
  @Prop({ default: "#226699" }) color!: string;
}
</script>
