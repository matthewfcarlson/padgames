<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <pre>{{game}}</pre>

    <button @click="game.StartGame()">StartGame</button>
    <button @click="game.AddPlayer('testing')">AddPlayer</button>
    <button @click="game.SetAsideCard(0,0)">GetFirstCard P1</button>
    <button @click="game.SetAsideCard(1,0)">GetFirstCard P2</button>
    <button @click="game.SetAsideCard(2,0)">GetFirstCard P3</button>
    
    
  </div>
</template>

<script>
import Game from "../common/game";
export default {
  name: 'Sushies',
  data () {
    return {
      msg: 'Sushi on the go',
      game: new Game()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
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
