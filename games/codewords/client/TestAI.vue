<template>
    <div>
        <input type="text" v-model="input1"/>
        <input type="text" v-model="input2"/>
        <input type="text" v-model="input3"/>
        {{input1}} - {{input2}} + {{input3}} = {{result}}

        <pre>{{similar}}</pre>
    </div>    
</template>

<script>
import loadModel from "../common/model";
import Vue from "vue";
import trainedmodel from "../common/data.json";

export default {
  name: "Test Codewords AI",
  data() {
    return {
      model: null,
      input1:"/en/",
      input2:"/en/",
      input3:"/en/",
      similar: []
    };
  },
  computed: {
      result(){
          this.similar.splice(0,3);
          if (this.model == null) return "???";
          var vec1 = this.model.getVector(this.input1);
          var vec2 = this.model.getVector(this.input2);
          console.log(vec1,vec2);
          if (vec1 == null || vec2 == null) return "Bad Word";
          var newVec = vec1.subtract(vec2);
          var newVec2 = vec2.subtract(vec1);
          console.log("New vec",newVec);
          var similar = this.model.similarity(this.input1,this.input2)
          console.log("Similar:",similar);
          
          var nearbyWords =  this.model.getNearestWords(newVec);
          console.log("Nearby",nearbyWords);
          var nearbyWords2 =  this.model.getNearestWords(newVec2);
          this.similar.push(nearbyWords);
          this.similar.push(nearbyWords2);
          console.log("Nearby",nearbyWords2);
          this.similar.push(this.model.mostSimilar(this.input1+" "+this.input2));
          
          if (this.input3 == "/en/") return "Waiting";
          
          var analogy = this.model.analogy(this.input1,[this.input2,this.input3]);
          return analogy;

      }
  },
  mounted() {
    var self = this;
    loadModel(trainedmodel, function(data, newModel) {
      console.log("Loaded model", data);
       self.model =newModel;
       console.log(self.model.GetWordList());
    });
    
  }
};
</script>