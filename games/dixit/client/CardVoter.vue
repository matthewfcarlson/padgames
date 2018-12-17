<template>
  <div class="container">
    <h2>Card List</h2>
    {{isPad}}
    {{cardList}}
    <div v-if="!isPad && !voted">
      TODO if we have a pad view, just let us pick the numbers instead of showing the pictures

      <button v-for="card in cardList" :key="card" @click="PickCard(card)">Vote on {{card}}</button>
    </div>
  </div>
</template>
<script>
import Vue from "vue";

export default {
  name: "CardPicker",
  data() {
    return {
        voted: false
    };
  },
  //players is the list of all the players and available is a list of the index of all avaiable players
  props: ["isPad", "cardList"],
  methods: {
    PickCard(cardValue) {
      this.$emit("submit", cardValue);
      this.voted = true;
    }
  },
};
</script>
