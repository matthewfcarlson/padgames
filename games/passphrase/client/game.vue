<template>
  <div class="phasephrase fullscreen-app escape-gutters" v-bind:style="appStyle">
    <div class="container">
      <div class="roomcode"><RoomCodeBox :code="roomCode"/></div>
      <Tutorial v-if="doTutorial" @done="finishTutorial"/>
      <div v-else>
        PASSPHRASE GAMEPLAY
      </div>
      
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import RoomCodeBox from "Client/components/RoomCode";
import Tutorial from "./tutorial";

@Component({
  components: {
    RoomCodeBox,
    Tutorial
  }
})
export default class PhasePhraseGame extends Vue {
  @Prop({default: '#226699'}) color!: string
  roomCode = "";
  doTutorial = true;
  mounted () {
    if (this.$route.params.roomId != undefined) this.roomCode = this.$route.params.roomId;
    console.log(this.appStyle);
  }
  get appStyle () {
    return {
      "background-color": this.color,
    }
  }
  finishTutorial () {
    this.doTutorial = false;
  }
}
</script>

<style scoped lang="scss">
.fullscreen-app {
  min-height:100vh;
  overflow-x:hidden;
}
.roomcode {
  float:right;
  margin: 1em;
}
</style>

