<template>
  <div class="contact">
    <NavBar />
    <div class="container pb-3">
      <h1>Please Contact Us</h1>
      <img
        src="~assets/undraw_contact_us.svg"
        class="img-fluid img-center"
        alt="the many ways to contact us"
      />
      <p>We want you to feel welcome to reach out and contact us</p>
      <a class="btn btn-lg btn-block btn-success" href="mailto:matt@padgames.app">
        <i class="far fa-envelope"></i> Reach out
      </a>
      <br />
      <div class="issues">
        <h2>Github Issues</h2>
        <p>If you find a bug, have a suggestion, or just want to say hi, file a suggestion on github! Here are some of the current issues.</p>
        <p v-if="error">{{error}}</p>
        <p v-else-if="!issues">No issues yet</p>
        <div v-else-if="issues.length == 0" class="text-center">
          <div class="spinner-border" role="status">
            <span class="sr-only">Loading...</span>
          </div>
          <p>Fetching issues from github</p>
        </div>
        <div v-else>
          <div class="card-columns">
            <div class="card" v-for="issue in issues" :key="issue.id">
              <div class="card-header">{{issue.title}}</div>
              <div class="card-body">
                <p v-show="issue.body.length > 0" class="card-text">{{issue.body}}</p>
                <p class="card-text">
                  <small class="text-muted">Last updated 3 mins ago</small>
                </p>
                <a :href="issue.html_url" class="btn btn-primary">Go to github</a>
              </div>
            </div>
            <div class="card text-white bg-primary">
              <div class="card-header">Add an issue</div>
              <div class="card-body mt-3 mb-3 text-center">
                <a href="https://github.com/matthewfcarlson/padgames/issues/new" class="text-white">
                  <span class="fa-stack fa-2x" style="vertical-align: top;">
                    <i class="fas fa-plus fa-stack-1x" />
                    <i class="far fa-circle fa-stack-2x"></i>
                  </span>
                </a>
              </div>
            </div>
          </div>
          <br />
          <button class="btn btn-info" @click="fetchIssues">Refresh Issues</button>
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
export default class Contact extends Vue {
  issues: any[] | boolean = false;
  error: string | boolean = false;
  fetchIssues() {
    this.issues = [];
    const request_url = `https://api.github.com/repos/matthewfcarlson/padgames/issues`;
    var self = this;
    axios
      .get(request_url)
      .then(response => {
        console.log(response);
        self.issues = response.data;
      })
      .catch(e => {
        self.error = e;
      });
  }
  created() {
    this.fetchIssues();
  }
}
</script>
