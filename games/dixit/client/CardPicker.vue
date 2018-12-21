<template>
  <div class="container-fluid">
    <h2 v-if="voting">Please Vote For a Card that best matches the clue</h2>
    <h2 v-else-if="storyTeller">Please pick a card and think of a clue</h2>
    <h2 v-else>Please pick a card that you think matches the clue</h2>
    <!-- if we haven't picked a card yet and we aren't voting -->
    <div v-if="!cardPicked">
      <transition-group
        name="card-list"
        appear
        tag="div"
        v-bind:css="false"
        v-on:enter="enter"
        v-on:before-enter="beforeEnter"
        v-on:leave="leave"
        v-scroll="OnScroll"
        class="slider"
      >
        <section
          v-for="(card,index) in cardList"
          :key="card"
          v-bind:data-index="index"
          class="dixit-card"
          @click="PickCard(card)"
        >
          <card :cardId="card"></card>
          <b v-if="isPad" class="text-center lead">{{index +1 }}</b>
        </section>
      </transition-group>
    </div>
    <!-- if we have picked a card and we are the story teller -->
    <div
      v-else-if="storyTeller"
    >Now take 30 second and think of a clue that really embodies your picture
      <card :cardId="cardIndex" style="max-width:400px"></card>
      <p>When you're ready press this button:</p>
      <button @click="PickCard(cardIndex)" class="btn btn-success btn-block btn-outline">Ready</button>
    </div>
    {{storyTeller}}
    <div v-else>You picked {{ cardIndex }}</div>
    <script src="https://bundle.run/css-scroll-snap-polyfill@0.1.2"></script>
  </div>
</template>
<script>
//Should the card picker and the card voter be combined?
import Vue from "vue";
import VueScroll from "vue-scroll";
import Card from "./Card";

import Velocity from "velocity-animate";

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
  props: {
    storyTeller: {
      default: false,
      type: Boolean
    },
    hand: {
      default: [],
      type: Array
    },
    isPad: {
      default: false,
      type: Boolean
    },
    havePad: {
      default: false,
      type: Boolean
    },
    voting: {
      default: false,
      type: Boolean
    }
  },
  computed: {
    cardList() {
      if (!this.cardPicked) return this.hand;
      return [this.cardIndex];
    }
  },
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
    },
    beforeEnter: function(el) {
      el.style.opacity = 0;
      el.style.transform = "translateY(-30px)";
    },
    enter: function(el, done) {
      var delay = el.dataset.index * 200;
      setTimeout(function() {
        Velocity(el, { opacity: 1, translateY: 0 }, { complete: done });
      }, delay);
    },
    leave: function(el, done) {
      var delay = el.dataset.index * 100;
      setTimeout(function() {
        Velocity(el, { opacity: 0, translateY: 300 }, { complete: done });
      }, delay);
    }
  }
};
</script>
<style scoped>
.slider {
  display: flex;
  border-radius: 10pt;
  background: #F16838;
}
section {
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
.card-list-move {
  transition: transform 1s;
}
.dixit-card {
  transition: all 1s;
  display: inline-block;
}
</style>
