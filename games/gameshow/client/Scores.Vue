<template>
  <div class="container">
    <h3>Scores</h3>
    <div class="row">
      <div v-for="team in teams" class="col" v-bind:key="team.name">
        {{team.name}}
        <h3>{{team.score}}</h3>
      </div>
    </div>
  </div>
</template>
<script>
import Vue from "vue";

export default {
  name: "TeamScores",
  data() {
    return {};
  },
  //players is the list of all the players and available is a list of the index of all avaiable players
  props: ["teams"]
};
</script>
