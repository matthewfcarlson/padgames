<template>
  <div class="phasephrase">
    <NavBar/>
    <div class="container">
      <h1>This is an the passphrase game page</h1>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({
  components: {
  }
})
export default class PhasePhraseGame extends Vue {}
</script>
