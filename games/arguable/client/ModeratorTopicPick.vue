<template>
<div class="content">
    <h2>Pick Your Topic</h2>
    {{topicList}}
</div>
</template>
<script>
import Vue from "vue";

const allTopicList = [
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
  mounted: function(){
    for (var i=0;i<5;i++){
      var randIndex = Math.floor(Math.random()*len(allTopicList));
      this.topicList.append(randIndex);
    }
  }
}
</script>
