<template>
  <div class="404">
    <NavBar />
    <div class="container text-center">
      <div class="jumbotron">
        <h1>404</h1>
        <img alt="happy sushi" class="w-25 img-center" src="~assets/default_sushi.png" />
        <h2>{{$route.path}} was not found!</h2>
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
export default class NotFound extends Vue {}
</script>
