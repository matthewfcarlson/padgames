<template>
  <div class="container-fluid">
    <h4>Teams</h4>
    <ul class="list-group list-group-flush">
      <a
        v-for="team in teams"
        v-bind:key="team.name"
        class="list-group-item list-group-item-action text-black"
        @click="clicked(team.name)"
      >
        {{team.name}}
        <span class="badge badge-pill badge-primary">{{team.sockets.length}} players</span>
      </a>
      <li class="list-group-item text-black" v-if="teams.length == 0">No Teams Yet</li>
    </ul>
  </div>
</template>
<script>
import Vue from "vue";

export default {
  name: "TeamsList",
  data() {
    return {};
  },
  methods: {
    clicked: function(team) {
      console.log("Clicked on team", team);
      this.$emit("click", team);
    }
  },
  //players is the list of all the players and available is a list of the index of all avaiable players
  props: ["teams"]
};
</script>
<style scoped>
.text-black,
.list-group-item.text-black {
  color: #333;
}
.list-group-item.text-black:hover {
  color: #533;
}
</style>