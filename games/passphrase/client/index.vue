<template>
  <div class="phasephrase">
    <NavBar/>
    <div class="container">
      <h1>This is an passphrase description page</h1>
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
