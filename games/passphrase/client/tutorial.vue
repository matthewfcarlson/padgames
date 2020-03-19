<template>
  <!-- TODO should this be moved to common code and use slots ?? -->
  <div class>
    <div class="text-center tutorial mb-3">
      <transition name="fade" mode="out-in">
        <div v-if="step == 1" key="1">
          <img src="./assets/passphrase_logo.svg" alt="game logo for the game" class="game-logo" />
          <h1>Passphrase</h1>
          <h2>A game of clever thinking</h2>
          <p>This game requires at least 3 people.</p>
          <p>Feel free to skip this tutorial if you already know how to play</p>
        </div>
        <div v-else-if="step == 2" key="2">
          <img src="./assets/teams.svg" alt="team description" class="game-logo" />
          <h2>This game has two teams:<br/>Red team and Blue Team</h2>
          <p>There are also two code masters, one for each team</p>
          <p>The code masters will have a phones and the rest of the team will use the centeral screen</p>
        </div>
        <div v-else-if="step == 3" key="3">
          <img src="./assets/cards.svg" alt="game board description" class="game-logo" />
          <h2>There will be words on the center screen that the team has to guess</h2>
          <p>The code masters have their teams words as well as the other team's words</p>
          <p>The code masters are trying to get their team to guess one or more of their team's words by using only one word and one number</p>
        </div>
        <div v-else-if="step == 4" key="4">
          <img src="./assets/codemaster.svg" alt="how codemasters give clues" class="game-logo" />
          <h2>Cat + Brush = Hair 2</h2>
          <p> For example, as a codemaster you might try to get your team to guess Cat and Brush. </p>
          <p> You might say <b>"Hair, 2"</b></p>
          <p> Your team would know to look for two words that relate to hair </p>
          <p> Remember, you are only allowed to use one word and one number. <i>The number does not have to be the number of cards you want your team to pick</i></p>
        </div>
        <div v-else-if="step == 5" key="5">
          <img src="./assets/passphrase_logo.svg" alt="picking a card" class="game-logo" />
          <h2> Once you reveal an incorrect card, your team's turn is over</h2>
          <p> One your team's turn, you may touch as many cards as you like, revealing whether they are red or blue or neither.</p>
          <p> You can elect as a team to end your turn voluntarily. If you flip a neutral card or a card for the other team, your turn is over automatically</p>
        </div>
        <div v-else-if="step == 6" key="6">
          <img src="./assets/death_card.svg" alt="the death card" class="game-logo" />
          <h2> Watch out for the death card </h2>
          <p> There is one card out there that will instantly end the game and you will lose</p>
          <p> So very a tad cautious when you are flipping cards. You never know which one might be certain death</p>
        </div>
        <div v-else-if="step == 7" key="7">
          <img src="./assets/passphrase_logo.svg" alt="form teams" class="game-logo" />
          <h2> Organize into teams now </h2>
          <p> Pick your code masters and make sure they have a phone joined to this room.</p>
          <p> If needed, they can share one phone. <b>Just make sure the other players can't see it</b></p>
        </div>

      </transition>
    </div>
    <div class="row">
      <div class="col">
        <button class="btn btn-warning btn-lg" @click="prev" v-if="step > 1">Back</button>
      </div>
      <div class="col text-right">
        <button class="btn btn-info btn-lg" @click="finish" v-if="step != max_steps">Skip</button>
        <button class="btn btn-success btn-lg" @click="next" v-if="step < max_steps" key="next">Next</button>
        <button class="btn btn-success btn-lg" @click="finish" v-else key="next">Finish</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class Tutorial extends Vue {
  step = 1;
  max_steps = 7;

  prev() {
    if (this.step > 1) this.step -= 1;
  }

  next() {
    if (this.step < this.max_steps) this.step += 1;
  }

  finish() {
    this.$emit("done");
  }
}
</script>

<style scoped lang="scss">
.roomcode-box {
  border-radius: 0.5em;
  color: white;
  background-color: black;
  padding: 1em;
  width: 15em;
}
.tutorial {
  min-height: 60vh;
  font-size:1.75em;
}
.game-logo {
  max-height: 50vh;
  max-width: 100%;
  height: auto;
}
h2 {
  font-size:2.2em;
}
h1 {
  color:white;
  font-size:2.5em;
  text-shadow: 1px 1px #fe4902, 
                2px 2px #fe4902, 
                3px 3px #fe4902;
}
</style>

