<template>
    <div @click="PickedCard" v-bind:class="classes" >
        {{card.name}} <span v-if="card.value>0">{{card.value}}</span>
    </div>
</template>

<script>
import Vue from "vue";
export default {
  props: ["card", "picked", "index"],
  name: "Sushies",
  methods: {
    PickedCard(vars, data) {
      console.log("Picked card from card");
      this.$emit("click", this.index);
    }
  },
  data() {
    return {};
  },
  computed: {
    classes() {
      return {
        card: true,
        "sushi-card": true,
        "col-sm": true,
        picked: this.card.picked,
        picked2: this.picked
      };
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.sushi-card {
  font-size: 11pt;
  padding-left: 0;
  padding-right: 0;
}
.sushi-card .card-body {
  padding: 0.25rem;
  text-align: center;
}
.sushi-card.picked {
  border-color: red;
  -webkit-box-shadow: 2px 2px 2px 2px rgba(136, 136, 136, 0.54);
  -moz-box-shadow: 2px 2px 2px 2px rgba(136, 136, 136, 0.54);
  box-shadow: 2px 2px 2px 2px rgba(136, 136, 136, 0.54);
}
</style>