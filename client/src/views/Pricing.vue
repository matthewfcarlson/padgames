<template>
  <div class="about">
    <NavBar />
    <div class="container">
      <h1>This is an about page</h1>
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
export default class Contact extends Vue {}
</script>
