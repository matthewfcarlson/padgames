<template>
  <div class="container">
    {{isPad}}
    {{cardList}}
    <div
      v-if="!voted"
    >TODO if we have a pad view, just let us pick the numbers instead of showing the pictures
      <transition-group
        name="card-list"
        appear
        tag="div"
        v-bind:css="false"
        v-on:enter="enter"
        v-on:before-enter="beforeEnter"
        v-on:leave="leave"
      >
        <div
          v-for="(card, index) in cardList"
          :key="card"
          v-bind:data-index="index"
          @click="PickCard(card)"
          class="dixit-card col-sm-3 col-lg-2"
        >
          <card :cardId="card"></card>
          <div v-if="isPad" class="text-center">{{index}}</div>
        </div>
      </transition-group>
      <button v-for="card in cardList" :key="card" @click="PickCard(card)">Vote on {{card}}</button>
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import Card from "./card";
import Velocity from "velocity-animate";

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
      if (this.isPad) return;
      this.$emit("submit", cardValue);
      this.voted = true;
    },
     beforeEnter: function (el) {
      el.style.opacity = 0;
      el.style.transform = "translateY(-30px)";
    },
    enter: function (el, done) {
      var delay = el.dataset.index * 200
      setTimeout(function () {
        Velocity(
          el,
          { opacity: 1, translateY: 0 },
          { complete: done}
        )
      }, delay)
    },
    leave: function (el, done) {
      var delay = el.dataset.index * 100
      setTimeout(function () {
        Velocity(
          el,
          { opacity: 0, height: 0 },
          { complete: done }
        )
      }, delay)
    }
  }
};
</script>
<style scoped>
.card-list-move {
  transition: transform 1s;
}
.dixit-card {
  transition: all 1s;
  display: inline-block;
}
.card-list-enter, .card-list-leave-to
/* .list-complete-leave-active below version 2.1.8 */ {
  opacity: 0;
  transform: translateY(30px);
}
.card-list-leave-active {
  position: absolute;
}
</style>

