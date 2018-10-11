<template>
<div>
    <div>Time left in the debate : {{secondsLeft}} </div>
    <div v-if="isModerator">
        <p>Make sure you ask good questions or stop players if they get out of hand.</p>
        <button @click="DebateDone" class="btn btn-block btn-warning">End the debate early</button>
    </div>
</div>
</template>
<script>
import Vue from "vue";


export default {
  name: "DebatingTimeLimit",
  data() {
    return {
        ready: false,
        timer: 120,
        counter: false,
        interval: null,
        secondsLeft: "2:00"
    };
  },
  methods: {
    DebateDone: function(){
      if (this.ready) return;
      this.ready = true;
      this.$emit("submit");
      clearInterval(this.interval);
    },
    startTimer() {
        this.interval = setInterval(this.countDown, 1000);
    },
    countDown() {
        console.log("counting down", this.timer)
        this.timer -= 1;
        var n = this.timer;
        if (n > 0) {
            this.secondsLeft = Math.floor(n/60) + ":" + (n%60);
        } 
        else {
           
            this.DebateDone();
        }
    }
  },
  beforeDestroy: function(){
      clearInterval(this.interval);
  },
  mounted: function(){
    this.startTimer();
  },
  props: ["isModerator"]

}
</script>
