<template>
  <div class="home">
    <NavBar />
    <!-- Main header -->
    <div class="container">
      <div class="jumbotron text-center bg-transparent">
        <h1 class="display-4 font-weight-bold">
          Play Games Together
          <br />Anywhere You Are
        </h1>
        <p class="lead">
          With access to dozens of games you can play when you’re sitting on the couch, on the road, or waiting in line with your family and friends.
          Stop staring at your phones silently and play together.
          With virtually unlimited players per game, it’s fun for everyone.
        </p>
        <router-link class="btn btn-primary btn-lg" to="/host" role="button">Host a Game</router-link>
        <router-link class="btn btn-success btn-lg" to="/join" role="button">Join a Game</router-link>
      </div>
    </div>
    <!-- Games that get your friends and family talking -->
    <div class="bg-primary escape-gutters text-white ">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-md-4 col-sm-12">
            <img
              src="/public/default_sushi.png"
              class="img-fluid img-center"
              alt="family playing together"
            />
          </div>
          <div class="col-md-8 col-sm-12">
            <br class="d-none d-md-block"/>
            <p class="lead font-weight-bold">Games that get your family or friends talking</p>
            <p>Most games work with a central tablet or two that everyone can see and then their phones act as controllers. Some games only require one phone per team.</p>
            <p> Games are flexible for your situation and some can be played with just phones or just the tablet in the middle.</p>
            <p>Since it is hosted on the internet, people can join from anywhere! You’ll need to be able to communicate with your teammates, so a phone call or discord is recommended.</p>
            <br class="d-none d-md-block"/>
          </div>
        </div>
      </div>
    </div>
    <!-- Mailing list signup -->
    <NewsLetter/>
    <div>
      Want to be updated on everything going on?
      Signup to our newsletter to hear the latest news! We promise few emails and we'll never give your email away.
      <input type="email" class="input-control" placeholder="your email here :)"/>
    </div>
    <!-- Game choices -->
    <div>
      A wide choice of games
      Ever been sitting around with your family or friends in the room, all on your phones, not talking? Games that are designed to help you talk and have fun together.
    </div>
    <!-- cost -->
    <div>
      What does it cost?
      Free to join
      $1 to host
      Joining games will always be free. Unlocking a game for $1 will give you unlimited hosts. Or you can unlock all the games for one low price of $X.99
    </div>    
    <!-- FAQ -->
    <div>FAQ</div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import NavBar from "../components/NavBar.vue"; // @ is an alias to /src
import NewsLetter from '../components/NewsLetter.vue';

@Component({
  components: {
    NavBar,
    NewsLetter
  }
})
export default class Home extends Vue {}
</script>

<style scoped lang="css">
</style>
