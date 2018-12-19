<template>
<div class="container">
    <h2>Card List</h2>
    {{storyTeller}}
    <button @click="PickCard" v-if="!cardPicked">pick A card</button>
</div>
</template>
<script>
import Vue from "vue";

export default {
  name: "CardPicker",
  data() {
    return {
        cardIndex: Math.round(Math.random() * 30),
        cardPicked: false
    };
  },
  //players is the list of all the players and available is a list of the index of all avaiable players
  props: ["storyTeller", "hand"],
  methods: {
      PickCard() {
          this.$emit("submit", this.cardIndex);
          this.cardPicked = true;
      }
  }
}
</script>
