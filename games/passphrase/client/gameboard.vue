<template>
  <div class="gameboard">
    <div v-for="wordRow in wordsLists" class="row mb-1" :key="wordRow.toString()">
      <div v-for="word in wordRow" class="col" :key="word">
        <CodeCard :word="word" @click="clickCard" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import CodeCard from "./card";

@Component({
  components: {
    CodeCard
  }
})
export default class PhasePhraseGame extends Vue {
  @Prop({ default: () => [] }) words!: string[];
  @Prop({ default: () => [] }) status!: number[];

  clickCard(e: Event) {
    // figure out what card was pressed?
    console.log(this.wordsLists);
    console.log(e);
  }
  get wordsLists() {
    
    const wordCount = this.words.length;
    const chunkSize = wordCount /5;
    let wordList = [];
    for (let index = 0; index < wordCount; index +=chunkSize){
        const chunk = this.words.slice(index, index + chunkSize);
        wordList.push(chunk);
    }

    return wordList;
  }
}
</script>

<style scoped lang="scss">
</style>

