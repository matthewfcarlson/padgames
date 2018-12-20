<template>
  <div>
    <img :src="imgSrc" class="img-fluid dixit-card">
  </div>
</template>
<script>
import Vue from "vue";
import Cards from "../common/cards";

export default {
  name: "Card",
  data() {
    return {};
  },
  //players is the list of all the players and available is a list of the index of all avaiable players
  props: ["cardId"],
  computed: {
    imgSrc() {
      var url = Cards.GetCardUrl(this.cardId);
      if (!url) return "/static/dixit_404.jpg";
      return "/static/dixit/" + url;
    }
  }
};
</script>
<style scoped>
.dixit-card {
    border-radius: 10pt;
}
</style>
