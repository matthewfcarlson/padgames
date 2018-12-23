<template>
  <div class="test content container">
    <div
      v-if="state != 'lobby' && (isPad || !hasPad)"
      is="Scores"
      :players="playerList"
      :isPad="isPad"
      :scores="scores"
    ></div>
    <br/>

    <input v-model="isPad" type="checkbox"/> IsPad
    <input v-model="hasPad" type="checkbox"/> hasPad
    <input v-model="state"/> state

    <input v-for="(score,index) in scores" v-model="scores[index]" :key="score"/> state
  </div>
</template>
<script>
import Vue from "vue";
import Scores from "./Scores";

export default {
  name: "Reveal",
  data() {
    return {
      playerList: ["Joe", "Schmo", "Bo"],
      scores: [5, 2, 3],
      isPad: true,
      hasPad: true,
      state: "reveal"
    };
  },
  components: {
    Scores
  },
  methods: {},
  computed: {}
};
</script>
<style scoped>
.content {
  min-height:100vh;
  /* Permalink - use to edit and share this gradient: http://colorzilla.com/gradient-editor/#f19b4d+0,ea8b31+100 */
  background: #f19b4d; /* Old browsers */
  background: -moz-linear-gradient(
    top,
    #f19b4d 0%,
    #ea8b31 100%
  ); /* FF3.6-15 */
  background: -webkit-linear-gradient(
    top,
    #f19b4d 0%,
    #ea8b31 100%
  ); /* Chrome10-25,Safari5.1-6 */
  background: linear-gradient(
    to bottom,
    #f19b4d 0%,
    #ea8b31 100%
  ); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
  filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#f19b4d', endColorstr='#ea8b31',GradientType=0 ); /* IE6-9 */
}

</style>
