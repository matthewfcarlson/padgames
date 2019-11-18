
<template>
  <div class="card panel-default text-center" @click="click">
    <div class="card-header upsidedown"> {{word}}</div>
    <div class="card-block">
      <b>{{word}}</b>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class CodeCard extends Vue {
  @Prop({ default: "???" }) word!: string;
  click(e: Event){
    this.$emit("click", e);
  }
}
</script>

<style scoped lang="scss">
.upsidedown {
  -webkit-transform: rotate(-180deg);
  -moz-transform: rotate(-180deg);
  -o-transform: rotate(-180deg);
  transform: rotate(-180deg);
  //ms-filter: "progid:DXImageTransform.Microsoft.BasicImage(rotation=2)";
  filter: progid:DXImageTransform.Microsoft.BasicImage(rotation=2);
}
.upsidedown.card-header {
  padding: 0;
}
.codeword {
  margin-top: 0.5em;
}
.card.red {
  border: 2px solid darkred;
  color: white;
  background-color: red;
}
.card.blue {
  border: 2px solid darkblue;
  color: white;
  background-color: blue;
}
.card.none {
  border: 2px solid yellow;
  color: white;
  background-color: gold;
}
.card.death {
  border: 2px solid black;
  color: white;
  background-color: #222;
}
.card-block{
  padding: 0.75em;
  b {
    display: inline-block;
    vertical-align: middle;
    font-size: 2vw;
  }
}
.card-block span {
  font-size: 2vw;
}
</style>

