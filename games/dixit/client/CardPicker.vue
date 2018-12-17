<template>
<div class="container">
    <h2>Card List</h2>
    {{storyTeller}}
    <button @click="PickCard">pick A card</button>
</div>
</template>
<script>
import Vue from "vue";

export default {
  name: "CardPicker",
  data() {
    return {
        cardIndex: 1
    };
  },
  //players is the list of all the players and available is a list of the index of all avaiable players
  props: ["storyTeller"],
  methods: {
      PickCard() {
          this.$emit("submit", this.cardIndex)
      }
  }
}
</script>
