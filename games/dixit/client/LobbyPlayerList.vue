<template>
<div class="container">
    <h2>Player List</h2>
    <ul class="list-group" >
      <div v-for="index in players" v-bind:key="index" class="list-group-item list-group-item-action">{{index}}</div>
    </ul>
</div>
</template>
<script>
import Vue from "vue";

export default {
  name: "PlayerList",
  data() {
    return {
    };
  },
  //players is the list of all the players and available is a list of the index of all avaiable players
  props: ["players"]
}
</script>
