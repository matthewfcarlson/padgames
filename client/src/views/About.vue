<template>
  <div class="about">
    <NavBar />
    <div class="container">
      <h1>This is an about page</h1>
      <img alt="Vue logo" class="img-fluid" src="/public/mockup.png" />
    </div>
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
