<template>
  <div class="phasephrase fullscreen-app escape-gutters" v-bind:style="appStyle">
    <div class="container">
      <div class="roomcode">
        <RoomCodeBox :code="roomCode" />
      </div>
      <div class="content">
        <Tutorial v-if="doTutorial" @done="finishTutorial" />
        <div v-else>
          <h1>PassPhrase</h1>
          <GameBoard :words="cards" :status="status" @click="clickCard"/>
          <a @click="restartTutorial">Help, I need the tutorial for me</a>
        </div>
      </div>
      <!-- End -->
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import RoomCodeBox from "Client/components/RoomCode";
import Tutorial from "./tutorial";
import GameBoard from "./gameboard";

@Component({
  components: {
    RoomCodeBox,
    Tutorial,
    GameBoard
  }
})
export default class PhasePhraseGame extends Vue {
  @Prop({ default: "#226699" }) color!: string;
  roomCode = "";
  status = []; //the status of each card
  cards = [
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
    "workforce",
    "worms"
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
  clickCard(index: number) {
    // figure out what card was pressed?
  }
}
</script>

<style scoped lang="scss">
.fullscreen-app {
  min-height: 100vh;
  overflow-x: hidden;
  position: relative;
}
// grab the mixins from bootstrap
@import "~bootstrap/scss/bootstrap";

.roomcode {
  @include media-breakpoint-up("lg") {
    // TODO: only do this on large screens. For small screens make it small and at the top
    position: absolute;
    top: 0;
    right: 0;
    margin: 1em;
  }
  @include media-breakpoint-down("md") {
    // TODO: only do this on large screens. For small screens make it small and at the top
    margin: 0.5em;
    * {
      padding:0.25em;
    }
  }
}
.content {
  position: absolute;
  top: 50%;
  width:100%;
  left:0;
  transform: translateY(-50%);
  padding-left:15px;
  padding-right:15px;
}
</style>

