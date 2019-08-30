<template>
  <div class="home">
    <NavBar/>
    <img alt="Vue logo" src="/public/default_sushi.png" />
    <HelloWorld msg="Welcome to Your Vue.js + TypeScript App" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import HelloWorld from "../components/HelloWorld.vue"; // @ is an alias to /src
import NavBar from "../components/NavBar.vue"; // @ is an alias to /src

@Component({
  components: {
    HelloWorld,
    NavBar
  }
})
export default class Home extends Vue {}
</script>
