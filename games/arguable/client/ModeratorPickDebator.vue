<template>
<div class="content">
    <h2>Pick Your Debators</h2>
    <div>Player List</div>
    Pick a player to debate for a topic:
    YES
    <ul class="list-group list-group-flush">
      <a v-for="index,player in players" v-bind:key="index" class="list-group-item list-group-item-action">{{player}} {{index}}</a>
    </ul>
    NO
    <ul class="list-group list-group-flush">
      <a v-for="index,player in players" v-bind:key="index" class="list-group-item list-group-item-action">{{player}} {{index}}</a>
    </ul>
</div>
</template>
<script>
import Vue from "vue";

export default {
  name: "ModeratorPickTheDebators",
  data() {
    return {
      yes: -1,
      no: -1
    };
  },
  props: ["players"]
}
</script>
