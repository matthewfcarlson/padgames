<template>
    <div>
        {{title}}
        <div class="row card-view">
            <template v-for="(card,index) in allCards">
                <card v-bind:card="card" v-bind:index="index" @click="PickedCard" v-bind:picked="card.picked" v-bind:key="card.name+index"></card>
            </template>
            
        </div>
        {{cardsSetAside}}
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
      type:Array,
    },
    cardsSetAside: {
      default: [],
      type:Array,
      validator: function (value) {
          if (typeof value == 'undefined') return false;
          if (typeof value != 'array') return false;
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
      return this.cards.map((x, index) => {
        x.picked = false;        
        if (typeof self.cardsSetAside !== 'undefined' && self.cardsSetAside.indexOf(index) != -1){
             x.picked = true;
             console.log("picked"+index);
        } else console.log(typeof self.cardsSetAside);
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

</style>