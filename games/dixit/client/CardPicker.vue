<template>
  <div class="container-fluid">
    <div v-if="!cardPicked" class="slider" v-scroll="OnScroll">
      <section v-for="card in hand" :key="card" @click="PickCard(card)">
        <card :cardId="card"></card>
      </section>
    </div>
    <div v-else-if="storyTeller">
      Now take 30 second and think of a clue that really embodies your picture
      <card :cardId="cardIndex"></card>
      When you're ready press this button:
      <button @click="PickCard(cardIndex)" class="btn btn-success btn-block btn-outline">Ready</button>
    </div>

    <div v-else>You picked {{ cardIndex }}</div>
    <script src="https://bundle.run/css-scroll-snap-polyfill@0.1.2"></script>
  </div>
</template>
<script>
import Vue from "vue";
import VueScroll from "vue-scroll";
import Card from "./Card";

Vue.use(VueScroll);
export default {
  name: "CardPicker",
  data() {
    return {
      cardIndex: Math.round(Math.random() * 30),
      cardPicked: false
    };
  },
  components: {
    Card
  },
  //players is the list of all the players and available is a list of the index of all avaiable players
  props: ["storyTeller", "hand"],
  methods: {
    PickCard(cardIndex) {
      this.cardIndex = cardIndex;
      if (this.storyTeller && !this.cardPicked) {
        this.cardPicked = true;
        return;
      }      
      this.$emit("submit", this.cardIndex);
      this.cardPicked = true;
    },
    OnScroll(e, position) {
      console.log("Scroll", position);
    }
  }
};
</script>
<style scoped>
.slider {
  display: flex;
}
section {
  border-right: 1px solid white;
  border-radius: 10pt;
  padding: 0.25rem;
  min-width: 30vw;
  text-align: center;
  position: relative;
  cursor: pointer;
  transition: 200ms;
  -webkit-transition: 200ms;
}
/* Landscape phone to portrait tablet */
@media (max-width: 767px) {
  section {
    min-width: 60vw;
    scroll-snap-align: center;
  }
  .slider {
    font-family: sans-serif;
    scroll-snap-type: mandatory;
    scroll-snap-points-x: repeat(60vw);
    scroll-snap-type: x mandatory;
    overflow-x: scroll;
    margin-left: -15px;
    margin-right: -15px;
  }
  .no-padding {
    padding: 0;
  }
}
@media (min-width: 768px) {
  section {
    min-width: unset;
    max-width: 20vw;
    /* margin-right: -15px; */
    /* margin-left: -15px; */
  }
  .slider {
    justify-content: center;
  }
}
</style>
