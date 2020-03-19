<template>
  <div class="404">
    <NavBar />
    <div class="container text-center">
      <div class="jumbotron">
        <img alt="happy sushi" class="w-25 img-center" src="~assets/undraw_happy_feeling.svg" />
        <h1>Joining Game</h1>
        <p class="lead">
          You'll need the room code to join.
          Ask the person hosting the game to share it with you.
          It will be a five letter word.
        </p>
        <hr />
        <div class="text-danger" v-if="error.length > 0">{{ error }}</div>
        <form v-if="!joining" @submit="JoinRoom">
          <div class="input-group">
            <input
              type="text"
              class="form-control"
              v-model="roomCode"
              placeholder="Room code"
              aria-label="The code to join the room"
            />
            <div class="input-group-append">
              <button type="submit" class="btn btn-primary btn-sm">Join</button>
            </div>
          </div>
        </form>
        <div v-else class="text-center">
          <div class="spinner-border" role="status">
            <span class="sr-only">Loading...</span>
          </div>
          <p>Trying to join {{roomCode}}...</p>
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import NavBar from "../components/NavBar.vue"; // @ is an alias to /src
import Footer from "../components/Footer.vue";
import NewsLetter from "../components/NewsLetter.vue";
import axios from "axios";

// TODO: idea? Interface between server and client that specify the methods we can call? Axios on client side?

@Component({
  components: {
    NavBar,
    Footer,
    NewsLetter
  }
})
// TODO: make the input convert to uppercase on the fly?
export default class Join extends Vue {
  roomCode = "";
  error = "";
  joining = false;
  mounted() {
    console.log(this.$route.params);
    if (this.$route.params.roomid != undefined)
      this.roomCode = this.$route.params.roomid;
    if (this.roomCode != "") this.JoinRoom(null);
  }
  JoinRoom(e: Event | null) {
    if (e != null) e.preventDefault(); // don't let the form submit
    if (this.joining) {
      return; // Don't try to join while we are joining
    }
    console.log(this.roomCode);
    if (this.roomCode.length != 5) {
      this.error = "This is an invalid room code"; //STRING
      return;
    }
    this.error = "";
    this.roomCode = this.roomCode.toUpperCase();
    console.log("Attempting to join room " + this.roomCode);
    //Should we do this via the server? Or should I do this via redirect?
    const request_url = location.origin + "/api/join/" + this.roomCode;
    console.log(request_url);
    const self = this;
    axios
      .get(request_url)
      .then(response => {
        const url = response.data.url;
        console.log(response);
        location.href = url;
      })
      .catch(reason => {
        self.error = "We couldn't find that room code"; //STRING
        console.log(reason);
      })
      .finally(() => {
        self.joining = false;
      });
    this.joining = true;
  }
}
</script>
