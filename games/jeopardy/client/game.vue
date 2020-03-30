<template>
  <div class="phasephrase fullscreen-app escape-gutters" v-bind:style="appStyle">
    <div class="container">
      <div class="roomcode">
        <RoomCodeBox :code="roomCode" />
      </div>
      <div class="content">
        
      </div>
      <!-- End -->
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import RoomCodeBox from "Client/components/RoomCode";

@Component({
  components: {
    
  }
})
export default class PhasePhraseGame extends Vue {
  @Prop({ default: "#060CE9" }) color!: string;
  roomCode = "";
}
</script>

<style lang="scss">
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
  @include media-breakpoint-up("lg") {
    position: absolute;
    top: 50%;
    width:100%;
    left:0;
    transform: translateY(-50%);
    padding-left:15px;
    padding-right:15px;
  }
}
</style>

