<template>
<div class="content">
    <h2>Pick Your Topic</h2>
</div>
</template>
<script>
import Vue from "vue";

export default {
  name: "ModeratorTopicPick",
  data() {
    return {
      gamesList: [],
      gameName: "",
      ready: false
    };
  },
}
</script>
