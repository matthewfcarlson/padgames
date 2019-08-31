<template>
  <div class="container">
    <NavBar />
    <div class="404 text-center">
      <div class="jumbotron">
        <h1>Not found!</h1>
      </div>
      <img alt="Vue logo" class="img-fluid img-center" src="/public/default_sushi.png" />
      <p>Sorry about that! Maybe you should <a class="btn btn-outline-primary" href="https://github.com/matthewfcarlson/padgames/issues/new"><i class="fab fa-github"></i> file an issue on Github?</a></p>
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
export default class NotFound extends Vue {}
</script>
