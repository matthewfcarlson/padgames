<template>
  <div class style="overflow-x:hidden">
    <div class="rabbit-container" :style="style">
      <div class="rabbit" v-bind:class="{animated: jumping}" v-on:animationend="endedAnimation">
        <div class="score">{{score}}</div>
      </div>
    </div>
    <div class="name text-center">{{name}}</div>
  </div>
</template>
<script>
import Vue from "vue";

export default {
  name: "Rabbit",
  data() {
    return {
      jumping: false
    };
  },
  //players is the list of all the players and available is a list of the index of all avaiable players
  props: ["score", "name"],
  watch: {
    score() {
      console.log("The rabbit with score " + this.score + " is jumping");
      this.jumping = true;
    }
  },
  methods: {
    endedAnimation() {
      this.jumping = false;
    }
  },
  computed: {
    style() {
      //TODO get maximum score
      var percent = Math.round((this.score / 30) * 100);
      return {
        transform: "translate(" + percent + "%)"
      };
    }
  }
};
</script>

<style scoped>
.rabbit-container {
  margin-top: 1em;
  margin-top: 1em;
}
.score {
  color: black;
  text-align: center;
}
.rabbit {
  width: 5em;
  height: 3em;
  background: #ffffff;
  border-radius: 70% 90% 60% 50%;
  position: relative;
  box-shadow: -0.2em 1em 0 -0.75em #b78e81;
  -moz-transform: rotate(0deg) translate(0em, 0);
  -ms-transform: rotate(0deg) translate(0em, 0);
  -webkit-transform: rotate(0deg) translate(0em, 0);
  transform: rotate(0deg) translate(0em, 0);
  transition: 1s;
  z-index: 1;
}

.no-flexbox .rabbit {
  margin: 10em auto 0;
}
.rabbit.animated:before {
  animation: kick 1s linear;
}
.rabbit.animated {
  animation: hop 1s linear;
}
.rabbit:before {
  content: "";
  position: absolute;
  width: 1em;
  height: 1em;
  background: white;
  border-radius: 100%;
  top: 0.5em;
  left: -0.3em;
  box-shadow: 4em 0.4em 0 -0.35em #3f3334, 0.5em 1em 0 white,
    4em 1em 0 -0.3em white, 4em 1em 0 -0.3em white, 4em 1em 0 -0.4em white;
}
.rabbit:after {
  content: "";
  position: absolute;
  width: 0.75em;
  height: 2em;
  background: white;
  border-radius: 50% 100% 0 0;
  -moz-transform: rotate(-30deg);
  -ms-transform: rotate(-30deg);
  -webkit-transform: rotate(-30deg);
  transform: rotate(-30deg);
  right: 1em;
  top: -1em;
  border-top: 1px solid #f7f5f4;
  border-left: 1px solid #f7f5f4;
  box-shadow: -0.5em 0em 0 -0.1em white;
}
@keyframes hop {
  20% {
    -moz-transform: rotate(-10deg) translate(0em, -2em);
    -ms-transform: rotate(-10deg) translate(0em, -2em);
    -webkit-transform: rotate(-10deg) translate(0em, -2em);
    transform: rotate(-10deg) translate(0em, -2em);
    box-shadow: -0.2em 3em 0 -1em #b78e81;
  }
  40% {
    -moz-transform: rotate(10deg) translate(0em, -4em);
    -ms-transform: rotate(10deg) translate(0em, -4em);
    -webkit-transform: rotate(10deg) translate(0em, -4em);
    transform: rotate(10deg) translate(0em, -4em);
    box-shadow: -0.2em 3.25em 0 -1.1em #b78e81;
  }
  60%,
  75% {
    -moz-transform: rotate(0) translate(0em, 0);
    -ms-transform: rotate(0) translate(0em, 0);
    -webkit-transform: rotate(0) translate(0em, 0);
    transform: rotate(0) translate(0em, 0);
    box-shadow: -0.2em 1em 0 -0.75em #b78e81;
  }
}
@keyframes kick {
  20%,
  50% {
    box-shadow: 4em 0.4em 0 -0.35em #3f3334, 0.5em 1.5em 0 white,
      4em 1.75em 0 -0.3em white, 4em 1.75em 0 -0.3em white,
      4em 1.9em 0 -0.4em white;
  }
  40% {
    box-shadow: 4em 0.4em 0 -0.35em #3f3334, 0.5em 2em 0 white,
      4em 1.75em 0 -0.3em white, 4.2em 1.75em 0 -0.2em white,
      4.4em 1.9em 0 -0.2em white;
  }
}
</style>
