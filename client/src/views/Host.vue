<template>
  <div class="404">
    <NavBar />
    <div class="container text-center">
      <div class="jumbotron">
        <img alt="happy sushi" class="w-25 img-center" src="~assets/undraw_happy_feeling.svg" />
        <h1>Creating your room</h1>
        <div class="text-danger" v-if="error.length > 0">{{ error }}</div>
        <div class="text-center">
          <div class="spinner-border" role="status">
            <span class="sr-only">Loading...</span>
          </div>
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
import axios from "axios";

@Component({
  components: {
    NavBar,
    Footer
  }
})
export default class Host extends Vue {
  error = "";
  gameType = "";
  mounted() {
    
    console.log(this.$route.params);
    if (this.$route.params.gameType != undefined)
      this.gameType = this.$route.params.gameType;
    if (this.gameType != "") this.HostGame();
    else this.error = "We didn't get a game type"; //str
  }
  HostGame() {
    console.log("Attempting to host room " + this.gameType);
    //Should we do this via the server? Or should I do this via redirect?
    const request_url = location.origin + "/api/host/" + this.gameType;
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
      });
  }
}
</script>
