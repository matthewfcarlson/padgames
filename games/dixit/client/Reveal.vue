<template>
  <div class="container">
    <div v-if="playerIndex < 0">Players who scored: {{scores}}</div>
    <div v-else>
      <h2 v-if="!isStoryTeller">You Picked: {{myPickedCard}}</h2>
      <h2 v-if="!isStoryTeller">The correct card was: {{correctCard}}</h2>
      <h2 v-if="!isStoryTeller">People who picked your card: {{numPeopleWhoPickedYourCard}}</h2>
      <h2>Number of people who picked the correct card: {{numCorrectPeople}}/{{players.length}}</h2>
      <button class="btn btn-block" @click="FinishReveal()">Done</button>
    </div>
  </div>
</template>
<script>
import Vue from "vue";

export default {
  name: "Reveal",
  data() {
    return {};
  },
  mounted: function() {
    setTimeout(this.FinishReveal, 8000);
  },
  methods: {
    FinishReveal() {
      this.$emit("submit");
    }
  },
  computed: {
    myPickedCard() {
      if (this.playerIndex < 0) {
        return -1;
      }
      return this.game.GetSelectedCard(this.playerIndex);
    },
     isStoryTeller: function() {
      if (this.playerIndex == -1) return false;
      if (this.game == null) return false;
      if (this.game.GetStoryTeller() == this.playerIndex) return true;
      return false;
    },
    players() {
      return this.game.GetPlayers();
    },
    numCorrectPeople() {
      return this.game.GetNumCorrectGuessers();
    },
    correctCard() {
      return this.game.GetSelectedCard(this.game.GetStoryTeller());
    },
    numPeopleWhoPickedYourCard() {
      var myCard = this.myPickedCard;
      var votes = this.game.GetVotes();
      var numPicked = votes.filter(x => x == myCard).length;
      return numPicked;
    },
    scores() {
      return this.game.GetPointsEarned();
    }
  },
  //players is the list of all the players and available is a list of the index of all avaiable players
  props: ["game", "playerIndex"]
};
</script>
