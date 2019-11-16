<template>
<!-- TODO should this be moved to common code and use slots ?? -->
  <div class="tutorial">
    <transition name="fade" mode="out-in" class="text-center">
      <div v-if="step == 1" key="1">
        <h1> Passphrase </h1>
        <h2> A game of clever thinking </h2>
        <p> This game requires at least 3 people.</p>
        <p> Feel fre to skip this tutorial if you already know how to play </p>
      </div>
      <div v-else-if="step == 2" key="2">Step 2</div>
      <div v-else-if="step == 3" key="3">Step 3</div>
      <div v-else-if="step == 4" key="4">Step 4</div>
    </transition>
    <div class="row">
      <div class="col">
        <button class="btn btn-warning btn-lg" @click="prev" v-if="step > 1">Back</button>
      </div>
      <div class="col text-right">
        <button class="btn btn-info btn-lg" @click="finish" v-if="step != max_steps">Skip</button>
        <button class="btn btn-success btn-lg" @click="next" v-if="step < max_steps" key="next">Next</button>
        <button class="btn btn-success btn-lg" @click="finish" v-else key="next">Finish</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class Tutorial extends Vue {
  step = 1;
  max_steps = 4;

  prev() {
    if (this.step > 1) this.step -= 1;
  }

  next() {
    if (this.step < this.max_steps) this.step += 1;
  }

  finish() {
    this.$emit("done");
  }
}
</script>

<style scoped lang="scss">
.roomcode-box {
  border-radius: 0.5em;
  color: white;
  background-color: black;
  padding: 1em;
  width: 15em;
}
.tutorial {
    padding-top: 4em;
}
</style>

