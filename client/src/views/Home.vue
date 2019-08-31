<template>
  <div class="home">
    <NavBar />
    <div class="container">
      <div class="jumbotron text-center bg-transparent">
        <h1 class="display-4">
          Play Games Together
          <br />Anywhere You Are
        </h1>
        <p class="lead">
          With access to dozens of games you can play when you’re sitting on the couch, on the road, or waiting in line with your family and friends.
          Stop staring at your phones silently and play together.
          With virtually unlimited players per game, it’s fun for everyone.
        </p>
        <router-link  class="btn btn-primary btn-lg" href="/host" role="button">Host a Game</router-link>
        <router-link class="btn btn-success btn-lg" to="/join" role="button">Join a Game</router-link>
      </div>      
    </div>
    <div>
      Games that get your family or friends talking
      Most games work with a central tablet or two that everyone can see and then their phones act as controllers. Some games only require one phone per team.
      Games are flexible for your situation and some can be played with just phones or just the tablet in the middle.
      Since it is hosted on the internet, people can join from anywhere! You’ll need to be able to communicate with your teammates, so a phone call or discord is recommended.
      watch how a game works
    </div>
    <div>
      A wide choice of games
      Ever been sitting around with your family or friends in the room, all on your phones, not talking? Games that are designed to help you talk and have fun together.
    </div>
    <div>
      What does it cost?
      Free to join
      $1 to host
      Joining games will always be free. Unlocking a game for $1 will give you unlimited hosts. Or you can unlock all the games for one low price of $X.99
    </div>
    <div>FAQ</div>
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
export default class Home extends Vue {}
</script>

<style scoped lang="css">

</style>
