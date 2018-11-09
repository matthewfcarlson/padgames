<template>
<div class="container">
    <h2>Pick Your Debators</h2>
    <b>Pick two players to debate for a topic:</b>
    <h3 v-if="yes == -1">YES</h3>
    <h3 v-else>{{players[yes]}} was picked to debate YES</h3>
    <ul class="list-group list-group-flush" v-if="yes == -1">
      <a v-for="index in avaialble" v-bind:key="index+'yes'" @click="PickYes(index)" class="list-group-item list-group-item-action">{{players[index]}}</a>
    </ul>
    <br/>

    <h3 v-if="no == -1">NO</h3>
    <h3 v-else>{{players[no]}} was picked to debate NO</h3>
    <ul class="list-group list-group-flush" v-if="yes != -1 && no == -1">
      <a v-for="index in avaialble" v-if="index != yes" v-bind:key="index+'no'" @click="PickNo(index)" class="list-group-item list-group-item-action">{{players[index]}}</a>
    </ul>

    <div v-if="yes != no && no != -1">
      <button class="btn btn-dark btn-block" @click="SelectDebators">Continue</button>
    </div>

</div>
</template>
<script>
import Vue from "vue";

export default {
  name: "ModeratorPickTheDebators",
  data() {
    return {
      yes: -1,
      no: -1
    };
  },
  methods: {
    PickYes: function(index){
      console.log("Picked Yes "+index)
      this.yes = index
    },
    PickNo: function(index){
      if (index == this.yes) return;
      console.log("Picked No "+index)
      this.no = index
    },

    SelectDebators: function(){
      console.log("MODERATOR PICK DEBATOR ",this.yes,this.no)
      this.$emit("submit", this.yes, this.no)
    },

  },
  //players is the list of all the players and available is a list of the index of all avaiable players
  props: ["players","avaialble"]
}
</script>
