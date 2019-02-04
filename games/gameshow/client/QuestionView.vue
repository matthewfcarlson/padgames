<template>
<div>
    <div v-if="!started" class="text-center">
        <button class="btn btn-primary btn-lg" @click="start">Click to Start</button>
    </div>
    <div v-else-if="question.id >= 0">
        <h1>When asked, <b>"{{GameData.questions[question.id]}}?"</b><h1>
        <h1>They said <b>"{{GameData.answers[question.person][question.id]}}"</b></h1>
    </div>
    <h2 v-if="currentTeamsTurn != ''"><b>{{currentTeamsTurn}}</b> is answering and they have <b>{{timeClock}} left</b></h2>
    <hr/>
</div>
</template>
<script>
import Vue from "vue";
import GameData from "../common/data";
console.log(GameData);
export default {
  name: "TeamsList",
  data() {
    return {
      GameData:GameData,
      timeLeft:-1,
      startTime: 15,
      started:false,
      interval:null,
    };
  },
  destroyed: function(){
      clearInterval(this.interval);
  },
  mounted: function(){
    this.interval = setInterval(this.tick, 1000);
  },
  watch: {
      currentTeamsTurn: function(val) {
          console.log("currentTeamsTurn changed");
          if (val != "") this.timeLeft = this.startTime;

      }
  },
  computed: {
      timeClock: function(){
          if (this.timeLeft < 10) return "0:0"+this.timeLeft;
          else return "0:"+this.timeLeft;
      }
  },
  methods: {
      start: function(){
          this.started = true;
      },
      tick: function(){
          if (!this.started) return;
          if (this.timeLeft > 0) {
              this.timeLeft --;
          
            if (this.timeLeft == 0){
                this.$emit("click");
            }
          }
      }
  },
  //players is the list of all the players and available is a list of the index of all avaiable players
  props: ["question","currentTeamsTurn"]
};
</script>
<style scoped>

</style>