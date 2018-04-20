<template>
    <div  v-bind:class="classes" >
        <div class="card-header" @click="PickedCard">
          <span v-if="card.value>0" class="card-value">{{card.value}}</span>
          <img src="https://artistalvarorubio.files.wordpress.com/2015/04/maralbarismos_sushi_cute-01.png"/>
        </div>
        <div class="card-body" @click="CardInfo">
          {{card.name}}   
        </div>
    </div>
</template>

<script>
import Vue from "vue";
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