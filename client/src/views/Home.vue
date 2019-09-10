<template>
  <div class="home">
    <NavBar />
    <!-- Main header -->
    <div class="container py-1">
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
    <div class="bg-primary escape-gutters text-white py-5">
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
            <br class="d-none d-md-block" />
            <p class="lead font-weight-bold">Games that get your family or friends talking</p>
            <p>Most games work with a central tablet or two that everyone can see and then their phones act as controllers. Some games only require one phone per team.</p>
            <p>Games are flexible for your situation and some can be played with just phones or just the tablet in the middle.</p>
            <p>Since it is hosted on the internet, people can join from anywhere! You’ll need to be able to communicate with your teammates, so a phone call or discord is recommended.</p>
            <br class="d-none d-md-block" />
          </div>
        </div>
      </div>
    </div>
    <!-- Game choices -->
    <div class="container py-5">
      <!-- TODO replace this BR with padding on the root container -->
      <br />
      <div class="row">
        <div class="col-md-4 col-lg-6 col-sm-12">
          <h4>A wide choice of games</h4>
        </div>
        <div
          class="col-md-8 col-lg-6 col-sm-12 text-muted"
        >Ever been sitting around with your family or friends in the room, all on your phones, not talking? Games that are designed to help you talk and have fun together.</div>
      </div>
      <br />
      <div class="row">
        <div class="col-sm-3 col-xs-6 p-1">
          <div class="bg-primary rounded" style="min-height:200px">Game 1</div>
        </div>
        <div class="col-sm-3 col-xs-6 p-1">
          <div class="bg-warning rounded" style="min-height:200px">Game 2</div>
        </div>
        <div class="col-sm-3 col-xs-6 p-1">
          <div class="bg-secondary rounded" style="min-height:200px">Game 3</div>
        </div>
        <div class="col-sm-3 col-xs-6 p-1">
          <div class="bg-info rounded" style="min-height:200px">Game 4</div>
        </div>
      </div>
      <br />
    </div>
    <!-- cost -->
    <div class="bg-secondary escape-gutters py-5">
      <div class="container">
        <div class="row align-items-center">
          <div class="col text-center">
            <h2>What does it cost?</h2>
            <h2 class="font-weight-bold">
              <span class="text-success">Free</span> to join
            </h2>
            <h2 class="font-weight-bold">
              <span class="text-success">$1</span> to host
            </h2>
            <br />
            <p>Joining games will always be free. Unlocking a game for $1 will give you unlimited hosts. Or you can unlock all the games for one low price of $X.99</p>
            <p class="secondary-text">The prices are really low just to keep the lights on. If you love padgames, <a href="https://ko-fi.com/padgames">consider donating!</a></p>
          </div>
          <div class="col">
            <img
              src="/public/default_sushi.png"
              class="img-fluid img-center"
              alt="family playing together"
            />
          </div>
        </div>
      </div>
    </div>
    <!-- FAQ -->
    <div class="bg-dark escape-gutters text-white py-5">
      <div class="container">
        <div class="row align-items-center">
          <div class="col">FAQ
            Why not, you know, make it free?
            Well, I origionally did. I don't think anybody besides my family and friends ever played.
            But if I wanted to start advertising and creating new games, I would probably need to charge.
            If you want to buy me some food, feel free to donate <a href="https://ko-fi.com/padgames">here</a>. 
          </div>
          <div class="col">
            <h1>FAQ</h1>
            <p>
              <span class="lead">Why did you start PadGames?</span>
              I was sitting around one christmas with my family and we were all on our phones in the same room.
              A few people asked if we could play some board games but no one was willing to setup the new board games we had just gotten.
              I wished that there was a way we could play our new games from our phones without having to setup the game.
            </p>
          </div>
          <div class="col">FAQ</div>
          <div class="col">FAQ</div>
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import NavBar from "../components/NavBar.vue"; // @ is an alias to /src
import Footer from "../components/Footer.vue";

@Component({
  components: {
    NavBar,
    Footer
  }
})
export default class Home extends Vue {}
</script>

<style scoped lang="css">
</style>
