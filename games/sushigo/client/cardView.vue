<template>
    <div>
        
        <div class="card-view">          
          <div class="card-viewer">
            <div class="card-view-title">{{title}}</div>
            <template v-for="(card,index) in allCards">
                <card v-bind:card="card" v-bind:index="index" @click="PickedCard" v-bind:picked="card.picked" v-bind:key="card.name+index"></card>
            </template>
            </div>
        </div>
    </div>
</template>
<script>
import Card from "./card";
import Vue from "vue";
export default {
  components: {
    Card
  },
  props: {
    cards: {
      required: true,
      type: Array
    },
    cardsSetAside: {
      default: [],
      type: Array,
      validator: function(value) {
        if (typeof value == "undefined") return false;
        if (typeof value != "array") return false;
        return false;
      }
    },
    title: {
      type: String,
      default: ""
    }
  },
  name: "Sushies",
  computed: {
    allCards() {
      var self = this;
      if (this.cards == undefined) return [];
      return this.cards.map((x, index) => {
        x.picked = false;
        if (
          typeof self.cardsSetAside !== "undefined" &&
          self.cardsSetAside.indexOf(index) != -1
        ) {
          x.picked = true;
        }// else console.log(typeof self.cardsSetAside, self.cardsSetAside);
        return x;
      });
    }
  },
  methods: {
    PickedCard(index) {
      this.$emit("picked-card", index);
      console.log("Picked card from card view");
    }
  },
  data() {
    return {};
  }
};
</script>

<style scoped>
.card-view-title {
  -webkit-transform: rotate(90deg);
  -moz-transform: rotate(90deg);
  -o-transform: rotate(90deg);
  -ms-transform: rotate(90deg);
  transform: rotate(90deg);
  position: absolute;
  transform-origin: left top; 
  top:10pt;
}
.card-view {
  overflow-x: auto;
  overflow-y: hidden;
  width: 100%;
  height: 105pt;
}
.card-viewer {
  width: max-content;
  padding-left:20pt;
  position: relative;
}
</style>