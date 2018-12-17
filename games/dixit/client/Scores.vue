<template>
<div class="container">
    <h2>Scores</h2>
    <div v-for="player,index in players" v-bind:key="(player+index)">{{player}}: {{scores[index]}}</div>
    TODO if in pad mode, show bunnies
</div>
</template>
<script>
import Vue from "vue";

export default {
  name: "Scores",
  data() {
    return {
    };
  },
  //players is the list of all the players and available is a list of the index of all avaiable players
  props: ["isPad", "scores", "players"],
}
</script>
