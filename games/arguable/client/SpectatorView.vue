<template>
<div class="container">
    Spectator View
    <ul class="list-group" >
      <div v-for="player,index in players" v-bind:key="player" class="list-group-item list-group-item-action">
          {{player}} {{index}} {{pressure[index]}}
        </div>
    </ul>
    {{pressure}}
</div>
</template>
<script>
import Vue from "vue";

export default {
  name: "SpectatorView",
  data() {
    return {
    };
  },
  computed: {
      players: function(){
          return this.currentGame.GetPlayers();
      },
      pressure: function(){
          var self = this;
          return this.players.map(function(value,index){
              return self.currentGame.GetPressure(index);
          });
      }
  },
  props: ["game"]
}
</script>
