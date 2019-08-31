<template>
  <div class="404 container">
    <NavBar />
    <div class="jumbotron">
      <h1>Not found!</h1>
    </div>
    <img alt="Vue logo" class="img-fluid img-center" src="/public/default_sushi.png" />
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
export default class NotFound extends Vue {}
</script>
