<template>
  <div class="container">
    <h3>Scores</h3>
    <div class="row" style="color:#333">
      <div v-for="team in teams" class="col" v-bind:key="team.name">
          <div class="card">
            <h5 class="card-header">
                {{team.name}}
            </h5>
            <div class="card-body">
                <h3>{{team.score}}</h3>
            </div>
        </div>
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
