<template>
    <div  v-bind:class="classes" >
        <div class="card-header" @click="PickedCard" v-bind:style="headerStyle">
          <span v-if="card.value>0" class="card-value">{{card.value}}</span>
          <img v-bind:src="imgSrc"/>
        </div>
        <div class="card-body" @click="CardInfo">
          {{card.name}} <small>{{hint}}</small>
        </div>
    </div>
</template>

<script>
import Vue from "vue";
function GetCardColor(card){
  switch(card.type){
    case "sashimi": return "green";
    case "nigiri": return "yellow";
    case "maki": return "red";
    case "dumpling": return "lightblue";
    case "chopsticks": return "cyan";
    case "tempura": return "purple";
    case "pudding": return "pink";
    case "wasabi": return "lightgreen";
    default: {
      console.error("Unknown card type",card.type);
      return "gray";
    }
  }
}

export default {
  props: ["card", "picked", "index"],
  name: "Sushies",
  methods: {
    PickedCard() {
      console.log("Picked card from card");
      this.$emit("click", this.index);
    },
    CardInfo() {
      console.log("Info wanted for card from card");
      this.$emit("card-info", this.index);
    }
  },
  data() {
    return {};
  },
  computed: {
    classes() {
      return {
        card: true,
        "sushi-card": true,
        picked: this.card.picked,
        picked2: this.picked
      };
    },
    headerStyle(){
      var style = {
        "background-color":GetCardColor(this.card)
      };
      return style;
    },
    imgSrc(){
      if (this.card == undefined || this.card.type == undefined) return "N/A";
      switch(this.card.type){
        case "nigiri": 
          if (this.card.value == 1) return "/static/egg_nigiri.png";
          if (this.card.value == 2) return "/static/nigiri.png";
          if (this.card.value == 3) return "/static/squid_nigiri.png";
        case "pudding": return "/static/pudding.png";
        default: {
          return "/static/default_sushi.png";
        }
      }
    },
    hint(){
      if (this.card == undefined || this.card.type == undefined) return "N/A";
      switch(this.card.type){
        case "sashimi": return "x3=10";
        case "nigiri": return this.card.value;
        case "maki": return "";
        case "dumpling": return "";
        case "chopsticks": return "Grab 2";
        case "tempura": return "x2=5";
        case "pudding": return "";
        default: {
          return "";
        }
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.sushi-card {
  font-size: 11pt;
  padding-left: 0;
  padding-right: 0;
  width: 75pt;
  margin-right:2pt;
  height: 100pt;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  transition: 0.3s;
  display:inline-block;
}
.sushi-card:hover {
  box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
}

.sushi-card .card-header {
  height:75pt;
  padding:0;
  position: relative;
}
.sushi-card .card-header img{
  width:100%;
  position: absolute;
  bottom:0;
  right:0;
  left:0;
}
.sushi-card .card-header .card-value{
  position: absolute;
  top:2pt;
  right:2pt;
}
.sushi-card .card-body {  
  padding:0;
  padding-left:1pt;
  padding-right:1pt;
}
.sushi-card.picked {
  border-color: rgba(255, 0, 0, 0.5);
  box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
}
</style>