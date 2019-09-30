<template>
  <div class="phasephrase">
    <NavBar/>
    <div class="container">
      <h1>This is an werewolves description page</h1>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

import NavBar from "Client/components/NavBar.vue"; // @ is an alias to /src
import Footer from 'Client/components/Footer.vue';

@Component({
  components: {
    NavBar,
    Footer
  }
})
export default class WereWolves extends Vue {}
</script>
