<template>
<div>
    <div>Vote for the player you think did best! Regardless of how you personally feel about the topic.</div>
    <div v-if="!voted">
        <button class="btn btn-block btn-success" @click="Yes">Vote Yes!</button>
        <button class="btn btn-block btn-danger" @click="No">Vote No!</button>
    </div>
    <div v-else>
        Thanks for voting!
    </div>
    
</div>
</template>
<script>
import Vue from "vue";


export default {
  name: "DebatingTimeLimit",
  data() {
    return {
        voted: false
    };
  },
  methods: {
    Yes: function(){
        this.voted = true;
        this.$emit("submit","Yes");
    },
    No: function(){
        this.voted = true;
        this.$emit("submit","No");
    }
  }
}
</script>
