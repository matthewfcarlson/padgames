<template>
  <div class="contact">
    <NavBar/>
    <h1>This is an contact page</h1>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import NavBar from "../components/NavBar.vue"; // @ is an alias to /src

@Component({
  components: {
    NavBar
  }
})
export default class Contact extends Vue {}
</script>
