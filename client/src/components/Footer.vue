<template>
  <div class="bg-dark escape-gutters text-white py-5 text-sm">
    <div class="container-fluid">
      <div class="row">
        <div class="col">
          Made with love by Matthew Carlson
          ©2019 | All rights reserved
        </div>
        <div class="col">
          <ul class="list">
            <li>
              <a href="https://ko-fi.com/padgames">Donate</a>
            </li>
          </ul>
        </div>
        <div class="col">
          <NewsLetter />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import NewsLetter from "./NewsLetter.vue";

@Component({
  components: {
    NewsLetter
  }
})
export default class Footer extends Vue {}
</script>

<style scoped lang="scss">
</style>

