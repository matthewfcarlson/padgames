<template>
<div class="container">
    <h2>Pick Your Topic</h2>
    <ul class="list-group list-group-flush">
      <a v-for="topic,index in topicList" v-bind:key="index" @click="PickTopic(topic)" class="list-group-item list-group-item-action">{{topic}}?</a>
    </ul>
    
</div>
</template>
<script>
import Vue from "vue";
//Pink
//Blue
//Yellow
//Green
//Brown
const allTopicList = [
    "Should organ donation be mandatory",
    "Should men be allowed to vote",
    "Should women have to put the toliet seat down",
    "Should trucks be illegal",
    "Should buses get their own highways",
    "Should diapers be free",
    "Should there be universal basic income",
    "Should Future Farmers of America be a required class in High School",
    "Should bottled watered by banned",
    "Is a college education worth it",
    "Should the US keep Daylight Savings Time",
    "Is golf a sport",
    "Is homework benefical",
    "Is drinking milk healthy for humans",
    "Is obesity a disease",
    "Is the moon real",
    "Are athletes paid too much",
    "Is breakfast cereal a soup",
    "Are selfies stupid",
    "Are santa's elves slaves",
    "Should we get rid of all silveware except the spork",
    "Should guys be allowed to wear tank tops",
    "Is it okay for girls to be significantly older than the guys they date (2-3 years)",
    "Are trix just for kids",
    "Is cheese the best food in the world",
    "Is 'derp' a real word",
    "Is cake better than cookies",
    "If Hogwarts sent your child an acceptance letter, would you let them attend",
    "Are aliens real",
    "Is country music any good",
    "Can adults see why kids love the taste of Cinnamon toast Crunch",
    "Is love more important than money",
    "Is it possible to be perfectly happy",
    "Is rose a good tasting flavor",
    "Did the egg come before the chicken",
    "Can a 10 year old stay home alone",
    "Do you have to be good looking to be popular",
    "Should daily showers be a requirement",
    "Should you date a nerd",
    "Are soft shell tacos better than crunchy",
    "Would life be better if we didn't have to eat",
    "Is burping more embarressing than farting",
    "Do you know the muffin man",
    "Would men be able to handle childbirth better than women",
    "Can pugs be police dogs",
    "Is it kay to pee while taking a shower",
    "Should the 'Deer Crossing' signs should be moved away from areas of heavy traffic, so the deer can cross safely",
    "Is chocolate better than vanilla",
    "Would it be fun to be a ghost and haunt people",
    "Do The Beatles even exist",
    "Can Barack Obama control the weather",
    "Is the LHC a device for awakening an ancient Egyptian god",
    "Is Jay-Z a time travelling vampire",
    "Is the earth hollow",
    "Did dinosaurs help build the pyramids",
    "Are poptarts ravioli",
    "Is pluto a planet",
    "Should a school district buy tablets instead of textbooks",
    "Can good exist without evil",
    "Would it be cool to be a dragon",
    "Should criminals be punished harder",
    "Should boys and girls be in seperate classes",
    "Should children be banned from fancy restaurants",
    "Is overpopulation the greatest threat to humanity",
    "Can tin foil hats protect you against alien mind readers",
    "Should ads for alcohol be prohibited",
    "Is a hotdog a sandwich",
    "Are magic 8 balls more reliable than tarot cards",
    "Are blueberries better than strawberries",
    "Should people be allowed to put pineapple on pizza",
    "Are cats better than dogs",
    "Do penguins have knees",
    "Should they make more male barbies",
    "Would batman beat superman in a fight",
    "Is the earth flat",
    "Should junk food be banned from public schools",
    "Should you kiss with your eyes closed vs eyes open",
    "Is American Idol better than America's Got Talent",
    "Are women are more complicated than men",
    "Are pirates are cooler than ninjas",
    "Are we aliens",
    "Should guys be allowed to wear tight pants",
    "Should you plan your own funeral",
    "Are diamonds really a girl's best friend",
    "Are girls weird when they are PMSi-ing",
    "Are memes good",
    "Should a dog's front legs be called arms",
    "Are clowns scary instead of funny",
    "Is pizza better than pasta",
    "Is Pepsi better than Coke",
    "Is weed better than Alcohol",
    "Are tacos better than burritos",
    "When you die in Canada, do you die in real life",
    "Is mayonnaise an instrument",
    "Should kids go to school 5 days a week",
    "Should schools kids have to wear school uniforms",
    "Should tablets replace textbooks in K-12 schools",
    "Do violent video games contribute to youth violence"
]
export default {
  name: "ModeratorTopicPick",
  data() {
    return {
      topicList: [],
    };
  },
  mounted: function(){
    for (var i=0;i<5;i++){
      var randIndex = Math.floor(Math.random()*allTopicList.length);
      var topic = allTopicList[randIndex];
      this.topicList.push(topic);
    }
  },
  methods: {
    PickTopic: function(topic){
      console.log("picked the topic")
      this.$emit("submit",topic);
    }
  }
}
</script>
