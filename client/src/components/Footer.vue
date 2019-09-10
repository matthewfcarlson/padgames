<template>
  <div class="bg-dark escape-gutters text-white py-5 text-sm">
    <div class="container">
      <div class="row">
        <div class="col">
          Made with love by Matthew Carlson
          ©2019 | All rights reserved
        </div>
        <div class="col">
          <ul class="list-unstyled">
            <li>
              <a href="https://ko-fi.com/padgames">Donate</a>
            </li>
          </ul>
        </div>
        <div class="col" v-if="showNewsletter">
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

