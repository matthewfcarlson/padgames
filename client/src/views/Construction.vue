<template>
  <div class="404">
    <NavBar />
    <div class="container text-center">
      <div class="jumbotron">
        <img alt="happy sushi" class="w-25 img-center" src="~assets/undraw_under_construction.svg" />
        <h1>Under Construction</h1>
        <p class="lead">
          padgames is still under construction.
          We're working hard to bring you awesome games!
          In the meantime, you can sign up for our news letter to be notified when anything changes.
        </p>
        <hr />
        <NewsLetter />
      </div>
    </div>
    <Footer />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import NavBar from "../components/NavBar.vue"; // @ is an alias to /src
import Footer from "../components/Footer.vue";
import NewsLetter from "../components/NewsLetter.vue";

@Component({
  components: {
    NavBar,
    Footer,
    NewsLetter
  }
})
export default class Construction extends Vue {}
</script>
