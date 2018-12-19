<template>
  <div class="container">
    {{isPad}}
    {{cardList}}
    <div v-if="!isPad && !voted">
      TODO if we have a pad view, just let us pick the numbers instead of showing the pictures
      <div class="row">
        <div v-for="card in cardList" :key="card" @click="PickCard(card)" class="col-sm-3 col-lg-2">
          <card :cardId="card"></card>
        </div>
      </div>
      <button v-for="card in cardList" :key="card" @click="PickCard(card)">Vote on {{card}}</button>
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import Card from "./card";

export default {
  name: "CardPicker",
  data() {
    return {
        voted: false
    };
  },
  //players is the list of all the players and available is a list of the index of all avaiable players
  props: ["isPad", "cardList"],
  components: {
    Card
  },
  methods: {
    PickCard(cardValue) {
      this.$emit("submit", cardValue);
      this.voted = true;
    }
  },
};
</script>
