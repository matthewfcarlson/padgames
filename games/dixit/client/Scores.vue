<template>
  <div class="">
    <h2>Scores</h2>
    <div v-if="isPad">
      <rabbit v-for="(player,index) in players" :score="scores[index]" :key="(player+index)" :name="player" ></rabbit>
    </div>
    <div v-else>
      <div v-for="(player,index) in players" v-bind:key="(player+index)">{{player}}: {{scores[index]}}</div>
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import Rabbit from "./Rabbit";

export default {
  name: "Scores",
  components: {
    Rabbit
  },
  data() {
    return {};
  },
  //players is the list of all the players and available is a list of the index of all avaiable players
  props: ["isPad", "scores", "players"]
};
</script>
