<template>
  <div class="phasephrase fullscreen-app escape-gutters" v-bind:style="appStyle">
    <div class="container">
      <div class="roomcode">
        <RoomCodeBox :code="roomCode" />
      </div>
      <Tutorial v-if="doTutorial" @done="finishTutorial" />
      <div v-else>
        PASSPHRASE GAMEPLAY
        <div class="row">
          <div v-for="word in words" class="col" :key="word"><CodeCard :word="word" @click="clickCard"/></div>
        </div>
        <a @click="restartTutorial">Help, I need the tutorial for me</a>
      </div>
      <!-- End -->
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import RoomCodeBox from "Client/components/RoomCode";
import Tutorial from "./tutorial";
import CodeCard from "./card";

@Component({
  components: {
    RoomCodeBox,
    Tutorial,
    CodeCard
  }
})
export default class PhasePhraseGame extends Vue {
  @Prop({ default: "#226699" }) color!: string;
  roomCode = "";
  words = [
    "week",
    "weight",
    "wendys",
    "west",
    "wheel",
    "widescreen",
    "wife",
    "wikipedia",
    "wind",
    "window",
    "winter",
    "wish",
    "witch",
    "wizard",
    "woman",
    "wonder",
    "wood",
    "wool",
    "workforce"
  ];
  // todo load from local storage whether we need to do the tutorial
  doTutorial = true;
  mounted() {
    if (this.$route.params.roomId != undefined)
      this.roomCode = this.$route.params.roomId;
  }
  get appStyle() {
    return {
      "background-color": this.color
    };
  }
  finishTutorial() {
    this.doTutorial = false;
    //save that we did the tutorial
  }
  restartTutorial() {
    this.doTutorial = true;
  }
  clickCard (e: Event) {
    // figure out what card was pressed?
  }
}
</script>

<style scoped lang="scss">
.fullscreen-app {
  min-height: 100vh;
  overflow-x: hidden;
}
.roomcode {
  // TODO: only do this on large screens. For small screens make it small and at the top
  position: absolute;
  top: 0;
  right: 0;
  margin: 1em;
}

</style>

