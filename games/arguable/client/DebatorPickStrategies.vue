<template>
<div class="container">
    <h2>Here's your strategies you'll be debating:</h2>
    <ul class="list-group list-group-flush">
      <li v-for="strategy,index in strategies" v-bind:key="index" class="list-group-item list-group-item-action">{{strategy}}</li>
    </ul>
    <div v-if="!ready">Think about what you want to do with your strategies. You'll have 30 seconds to think about it. The debate will last 2-4 minutes and will end when the moderator ends the debate.</div>
    <button v-if="!ready" @click="DebatorReady" class="btn btn-success btn-block">
        <span v-if="!ready">Click when you are ready ({{secondsLeft}})</span>
        <span v-else>You are ready!</span>
    </button>
</div>
</template>
<script>
import Vue from "vue";

const allStrategies = [
  "Gesticulate wildly",
  "Ask impossible question",
  "1 word: China",
  "Use animal metaphors",
  "You are on some serious drugs",
  "You're secretly a russian- don't let anyone know if you can help it",
  "Pretend you're holding an emotional support animal",
  "Compare your opponent to a serial killer",
  "All men are pigs",
  "Technology can solve all the problems",
  "You were injured in 'nam. Bring it up.",
  "Assume any claim that is made has a logical fallacy",
  "Always compromise- every position is too extreme one way or another",
  "Let your temper loose",
  "Never show any emotion",
  "Be politically correct",
  "Deny everything",
  "Respond to any theory with an every crazier one",
  "Use madeup science to support you",
  "Use your 178 IQ",
  "You can't believe your ears",
  "Attack your opponents gender",
  "Always apologize",
  "Everything is really funny",
  "Use the spirits in the room",
  "You can see in the future but no one can know",
  "Make groundless accustations",
  "Yes, you can really read minds",
  "The real problem is global warming",
  "Get really mad that your opponent eats meat",
  "You are daydreaming about something else",
  "Any fact presented to you is obviously a lie",
  "Quote an article you just read",
  "Use plenty of metaphors",
  "It's not your responsibility",
  "Make bad jokes as a distraction",
  "Ask questions but interrupt the answers",
  "Start every sentance with 'I wish...'",
  "Answer every question with 'According to my calculations'",
  "Facts confuse you"
];

export default {
  name: "ModeratorPickTheDebators",
  data() {
    return {
        strategies : [],
        ready: false,
        counter: false,
        interval: null,
        timeLeft: 0,
        secondsLeft: "0:25"
    };
  },
  computed: {
      secondsLeft: function(){
          var seconds = this.timeLeft;
          if (seconds < 10) seconds = "0"+seconds;
          return "0:"+seconds;
      }
  },
  methods: {
    DebatorReady: function(){
      if (this.ready) return;
      this.ready = true;
      this.$emit("submit");
      clearInterval(this.interval);
    },
    startTimer() {
        this.interval = setInterval(this.countDown, 1000);
        this.timeLeft = Math.round(this.timer /1000);
    },    
    countDown() {
        console.log("counting down", this.timeLeft)
        this.timeLeft -= 1000;
        if (this.timeLeft <= 0) {
            this.DebatorReady();
        }
    }
  },
  props: ["timer"],
  beforeDestroy: function(){
      clearInterval(this.interval);
  },
  mounted: function(){
    while(this.strategies.length < 2){
      var randIndex = Math.floor(Math.random()*allStrategies.length);
      var strategy = allStrategies[randIndex];
      if (this.strategies.indexOf(strategy) == -1)
        this.strategies.push(strategy);
    }
    this.startTimer();
  },

}
</script>
