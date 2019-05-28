<template>
  <div class="content">
    <h1>Matt Stocks</h1>
    <div class="text-center">
      <small>Made by Matthew Carlson</small>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import VueSocketio from "vue-socket.io";

Vue.use(VueSocketio, window.location.origin);

const ROOT = "Stocks:";

export default {
  name: "Stocks",
  /*components: {
    TeamList,
    QuestionView,
    Scores
  },*/
  data() {
    var self = this;

    var gameRoom = this.$route.params.gameID || "";
    var debug =
      location.hostname === "localhost" || location.hostname === "127.0.0.1";

    return {
      windowLocation: window.location.href
    };
  },
  computed: {

  },
  methods: {
    gameReset: function() {
      this.$socket.emit(ROOT + "reset");
    }
  },
  sockets: {
    connect: function() {
      this.$socket.emit(ROOT + "connect");
    },
  },
  mounted: function() {
    this.$socket.emit(ROOT + "connect");
  }
};
</script>
<style scoped>
.content {
  min-height: 100vh;
  /* Permalink - use to edit and share this gradient: http://colorzilla.com/gradient-editor/#f19b4d+0,ea8b31+100 */
  background: #262276;
  color: #fbe6cb;
}
.jumbotron h1,
.text-black {
  color: #333;
}
.btn-huuge {
  padding: 2.5rem 2rem;
  font-size: 2.25rem;
  line-height: 3rem;
}
</style>