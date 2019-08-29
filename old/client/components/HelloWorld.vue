
<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <div class="game" v-for="game in games" v-bind:key="game.name">      
      <router-link :to="{name:game.name}" v-if="'isGame' in game && game['isGame']">
        <h1>Play  {{game.title}}</h1>          
      </router-link>
    </div>
    Find an issue? <a href="https://github.com/matthewfcarlson/codewords/issues">Please log it here.</a>
    
  </div>
</template>

<script>
export default {
  name: "HelloWorld",
  data() {
    return {
      games: [],
    };
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1,
h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
