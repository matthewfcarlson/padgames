<template>
  <div class="about">
    <NavBar />
    <div class="container">
      <h1>Pricing</h1>
      <p class="lead"> Currently all games on padgames are <b>free!</b> This may change in the future depending on where this goes.</p>
      <a href="https://ko-fi.com/padgames"> Consider donating! </a>
      <p> Servers do cost money and right now and I'd love to be able to do this for free, but putting more time into would require financial support </p>
      <img src="~assets/undraw_unexpected_friends.svg" class="img-fluid img-center" alt="a fun picture of unexpected friends"/>
      <p> If/when padgames does become paid, all the games released prior to that point will remain free. Games after that will cost $1 to unlock the ability to host. </p>
      <p> Once you have unlocked that game, you can host as many games as you like. Joining a game will always be free. </p>
      <p> Feel free to reach out and <router-link to="contact">contact us</router-link> if you have any questions or concerns. We'd love to here from you!</p>
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
