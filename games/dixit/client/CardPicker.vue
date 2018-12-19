<template>
  <div class="container-fluid">
    <h2>Card List</h2>
    {{storyTeller}}
    <div v-if="!cardPicked" class="slider" v-scroll="OnScroll">
      <section v-for="card in hand" :key="card" @click="PickCard(card)">
        <h1>Pick {{card}}</h1>
        <img
          src="https://s-media-cache-ak0.pinimg.com/736x/d6/b3/41/d6b3417cdc74d85b3e16b6eda56bf247--board-games-writing-inspiration.jpg"
          class="img-fluid"
        >
      </section>
    </div>
    <div v-else>You picked {{ cardIndex }}</div>
    <script src="https://bundle.run/css-scroll-snap-polyfill@0.1.2"></script>
  </div>
</template>
<script>
import Vue from "vue";
import VueScroll from "vue-scroll";

Vue.use(VueScroll);
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
    PickCard(cardIndex) {
      this.cardIndex = cardIndex;
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
  padding: 1rem;
  min-width: 30vw;
  background: blue;
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
