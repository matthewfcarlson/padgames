<template>
<div class="content">
    <h2>Pick Your Topic</h2>
</div>
</template>
<script>
import Vue from "vue";

const topicList = [
    "Should men be allowed to vote",
    "Should women have to put the toliet seat down",
    "Should trucks be illegal",
    "Should buses get their own highways",
    "Should "
]
export default {
  name: "ModeratorTopicPick",
  data() {
    return {
      topicList: [],
      gameName: "",
      ready: false
    };
  },
}
</script>
