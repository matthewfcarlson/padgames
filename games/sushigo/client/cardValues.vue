<template>
    <div>
        <h3>Values of all the cards</h3>
    </div>
</template>
<script>
import Vue from "vue";
import Card from "./card";

export default {
  components: {
    Card
  },
  name: "Card Value Help",
  data() {
    return {};
  },
  props: {
    extended: {
      required: false,
      type: Boolean,
      default:false
    }
  }
};
</script>

<style scoped>
</style>