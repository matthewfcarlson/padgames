<template>
  <div class="roomcode-box text-center">
      <div>Room code:</div>
      <div class="code">{{code}}</div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class RoomCodeBox extends Vue {
    @Prop({default: false}) darkMode!: boolean;
    @Prop({default: "???"}) code!: string;
}
</script>

<style scoped lang="scss">
.roomcode-box {
    border-radius: 0.5em;
    color: white;
    background-color: black;
    padding:1em;
}
.roomcode-box .code {
    font-size: 2em;
    text-transform: uppercase;
}
</style>

