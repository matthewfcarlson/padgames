<template>
  <div class="container">
    <h2 v-if="!isStoryTeller">The correct card was: <card style="max-width:30vw" :cardId="correctCard"></card>{{correctCard}}</h2>
    <div v-if="playerIndex < 0">Players who scored: {{scores}}</div>
    <div v-else>
      <h2 v-if="!isStoryTeller">You Picked:<card style="max-width:20vw" :cardId="myPickedCard"></card></h2>      
      <h2 v-if="!isStoryTeller">People who picked your card: {{peopleWhoPickedYourCard}}</h2>
      <h2>Number of people who picked the correct card: {{numCorrectPeople}}/{{players.length}}</h2>
      <h2>You earned {{pointsEarned}} points</h2>
      
    </div>
    <button class="btn btn-block" @click="FinishReveal()">Done</button>
  </div>
</template>
<script>
import Vue from "vue";
import Card from "./Card";

export default {
  name: "Reveal",
  data() {
    return {};
  },
  components: {
    Card
  },
  mounted: function() {
    setTimeout(this.FinishReveal, 80000);
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
      var votes = this.game.GetVotes();
      return votes[this.playerIndex];
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
      console.log("Story teller:",this.game.GetStoryTeller());
      return this.game.GetSelectedCard(this.game.GetStoryTeller());
    },
    peopleWhoPickedYourCard() {
      var myCard = this.myPickedCard;
      var votes = this.game.GetVotes();
      var people = [];
      var players = this.players;
      votes.forEach((x,i)=> {
        if (x == myCard) people.push(i);
      });
      
      return people.join(", ")
    },
    pointsEarned(){
      var scores = this.game.GetPointsEarned();
      if (this.playerIndex < 0) return 0;
      return scores[this.playerIndex];
    },
    scores() {
      return this.game.GetPointsEarned();
    }
  },
  //players is the list of all the players and available is a list of the index of all avaiable players
  props: ["game", "playerIndex"]
};
</script>
