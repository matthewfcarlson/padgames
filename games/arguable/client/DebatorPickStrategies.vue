<template>
<div class="content">
    <h2>Pick Your Debators</h2>
    <div>Player List</div>
    Pick your strategies:
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

const strategies = [
  "Gesticulate wildly",
  "Ask impossible question",
  "1 word. China",
  "Let your temper loose",
  "Never show any emotion",
  "Be politically correct",
  "Deny everything",
  "Respond to any theory with an every crazier one",
  "Use madeup science to support you",
  "Use your 178IQ",
  "You can't beleive your ears",
  "Any fact presented to you is obviously a lie",
  "Quote an article you just read",
  "Use plenty of metaphors",
  "It's not your responsibility",
  "Make bad jokes as a distraction",
  "Ask questions but interrupt the answers",
  "Start every sentance with 'I wish...'",
  "Answer every question with 'According to my calculations'",
  "Facts confuse you"
]

export default {
  name: "ModeratorPickTheDebators",
  data() {
    return {
      strategies : []
    };
  },

}
</script>
