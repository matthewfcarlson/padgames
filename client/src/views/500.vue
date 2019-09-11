<template>
  <div class="404">
    <NavBar />
    <div class="container text-center">
      <div class="jumbotron">
        <h1>500</h1>
        <img alt="happy sushi" class="w-25 img-center" src="/public/undraw_bug_fixing.svg" />
        <h2>Something isn't right!</h2>
        <p class="lead">Sorry about that! Maybe you should <a class="btn btn-outline-primary" href="https://github.com/matthewfcarlson/padgames/issues/new"><i class="fab fa-github"></i> file an issue on Github?</a></p>
      </div>
    </div>
    <Footer/>
  </div>
  
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import NavBar from "../components/NavBar.vue"; // @ is an alias to /src
import Footer from '../components/Footer.vue';

@Component({
  components: {
    NavBar,
    Footer
  }
})
export default class ServerError extends Vue {}
</script>
