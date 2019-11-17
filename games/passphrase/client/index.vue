<template>
  <div class="phasephrase">
    <NavBar/>
    <div class="container">
      <div class="row">
      <div class="col">
        <img src="./assets/passphrase_logo.svg" alt="game logo for the game" class="game-logo" />
      </div>
      <div>
        <h1>PassPhrase</h1>
        <p>Pass phrase</p>
        <p>TODO: tutorial here? </p>
      </div>
      <router-link tag="button" :to="passphrase_game" class="btn btn-success">Host a Game</router-link>
      </div>
      {{ color }}
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

import NavBar from "Client/components/NavBar.vue"; // @ is an alias to /src
import Footer from 'Client/components/Footer.vue';

@Component({
  components: {
    NavBar,
    Footer
  }
})
export default class PassPhrase extends Vue {
  @Prop({default: '#226699'}) color!: string
}
</script>
