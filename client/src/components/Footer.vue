<template>
  <div class="bg-black escape-gutters text-white py-5 text-sm">
    <div class="container">
      <div class="row">
        <div class="col-md col-sm-12">
          Made with love by Matthew Carlson<br/>
          ©2019 | All rights reserved
        </div>
        <div class="col-md col-sm-12">
          <ul class="list-unstyled link-white">
            <li>
              <a href="https://ko-fi.com/padgames">Donate</a>
            </li>
            <li>
              <router-link to="about">About</router-link>
            </li>
            <li>
              <router-link to="contact">Contact Us</router-link>
            </li>
            <li>
              <a href="https://github.com/matthewfcarlson/padgames">Github</a>
            </li>
            <li>
              <router-link to="privacy">Privacy Policy</router-link>
            </li>
            <li>
              <a href="/sitemap.xml">Sitemap</a>
            </li>
          </ul>
        </div>
        <div class="col-md col-sm-12" v-if="showNewsletter">
          <NewsLetter />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
//TODO make sure that this is at the bottom of the screen?
import { Component, Vue, Prop } from "vue-property-decorator";
import NewsLetter from "./NewsLetter.vue";

@Component({
  components: {
    NewsLetter
  }
})
export default class Footer extends Vue {
  @Prop({default: false}) private showNewsletter!: boolean;
}
</script>

<style scoped lang="scss">
</style>

