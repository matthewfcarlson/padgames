
<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <div class="game" v-for="game in games" v-bind:key="game.name">      
      <router-link :to="{name:game.name}" v-if="'isGame' in game">
        <h1>Play  {{game.title}}</h1>          
      </router-link>
    </div>
    
    
  </div>
</template>

<script>
import {GameRoutes} from '../../games/'
export default {
  name: "HelloWorld",
  data() {
    return {
      games: GameRoutes,
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
