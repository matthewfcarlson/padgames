<template>
<div class="content">
    <h1>Arguable Game 
      <div class="pull-right lead badge badge-warning " v-if="pressureLevel == 1">Under Pressure!</div>
      <div class="pull-right lead badge badge-danger " v-if="pressureLevel == 2">I'm out!</div>
    </h1>
    
    <h2 class="speech-bubble" v-if="topic != ''">{{topic}}</h2>
    
    <h2 v-if="YesDebatorName != ''" class="text-center well">
      <span class="text-success">{{YesDebatorName | uppercase}}</span> 
      <small>vs</small> 
      <span class="text-danger">{{NoDebatorName | uppercase}} </span>
    </h2>
    <h3 v-if="currentRole != ''">You are {{currentRoleFriendly}}</h3>
    <h2 class="speech-bubble" v-if="currentRole == 'debate_yes'">Yes!</h2>
    <h2 class="speech-bubble" v-if="currentRole == 'debate_no'">No!</h2>
    <div is="DebatingTimeLimit" v-if="state == 'debating'" @submit="DebateFinished" v-bind:isModerator="isModerator"></div>

    <div v-if="playerIndex == -1">
      <input type="text" class="form-control" placeholder="Your name" v-model="playerName" />
      <br/>
      <button class="btn btn-primary btn-block" @click="JoinGame()">Join Game</button>
    </div>
    <button v-else-if="state=='lobby'" class="btn btn-primary btn-block" @click="StartGame">Start Game</button>
   
    <div is="ModeratorPickDebator"  v-else-if="isModerator && state == 'first_mod'" @submit="PickedDebators" v-bind:players="playerList" v-bind:avaialble="pickAblePlayerIndexs"></div>
    <div is="ModeratorTopicPick" v-else-if="isModerator && state == 'moderate_topic'" @submit="PickedTopic"></div>
    <div is="DebatorPickStrategies" v-else-if="isDebator && (state == 'debate_waiting'|| state == 'debating')" @submit="DebatorReady"></div>    
    <div is="Voting" v-else-if="!isDebator && state == 'voting'" @submit="Voted"></div>    
    <div v-else>
      Waiting...
    </div>

    <pre v-if="currentGame != null && debug">
      {{playerList}}
      {{state}}
      Role: {{currentRole}}
      Moderator: {{moderator}}
      PlayerIndex: {{playerIndex}}
      YES: {{currentGame.GetYesDebator()}}
      NO: {{currentGame.GetNoDebator()}}
      Pressure: {{pressureLevel}}
    </pre>
    
</div>
</template>

<script>
import Vue from "vue";
import VueSocketio from "vue-socket.io";
import ArgueGame from "../common/argueGame";
import ModeratorTopicPick from "./ModeratorTopicPick";
import ModeratorPickDebator from "./ModeratorPickDebator";
import DebatorPickStrategies from "./DebatorPickStrategies";
import DebatingTimeLimit from "./DebatingTimeLimit";
import Voting from "./Voting";

Vue.filter("uppercase", function(value) {
  if (!value) return "";
  value = value.toString();
  return value.toUpperCase();
});
Vue.filter("capitalize", function(value) {
  if (!value) return "";
  value = value.toString();
  return value.charAt(0).toUpperCase() + value.slice(1);
});

Vue.use(VueSocketio, window.location.origin);
const ROOT = "Argue:";
export default {
  name: "Arguable",
  data() {
    return {
      currentGame: null,
      count: 0,
      playerIndex: -1,
      playerName: "Default",
      debug: (location.hostname === "localhost" || location.hostname === "127.0.0.1")
    };
  },
  components: {
    ModeratorPickDebator,
    ModeratorTopicPick,
    DebatorPickStrategies,
    DebatingTimeLimit,
    Voting
  },
  created: function() {
    this.gameRoom = this.$route.params.gameID || "";
    var names = [
      "Billy",
      "Bob",
      "Joe",
      "Sue",
      "Ellen",
      "Tj",
      "Safiye",
      "Jeff",
      "Kira",
      "Matt",
      "Jeremy",
      "Star",
      "James",
      "Lily",
      "Simon",
      "Norman",
      "Ruby",
      "Craig",
      "Dominica",
      "Ruth"
    ];
    if (this.playerName == "Default")
      this.playerName = names[Math.floor(Math.random() * names.length)];
  },
  computed: {
    pickAblePlayerIndexs: function() {
      if (this.currentGame == null) return [];
      return this.currentGame.GetAvailablePlayerIndexs();

      //filter out the moderator
    },
    playerList: function() {
      if (this.currentGame == null) return [];
      return this.currentGame.GetPlayers();
    },
    state: function() {
      if (this.currentGame == null) return [];
      return this.currentGame.GetState();
    },
    moderator: function() {
      if (this.currentGame == null) return [];
      return this.currentGame.Moderator();
    },
    isModerator: function() {
      if (this.currentGame == null) return [];
      return this.currentGame.Moderator() == this.playerIndex;
    },
    isDebator: function() {
      if (this.currentGame == null) return false;
      if (this.currentGame.GetYesDebator() == this.playerIndex) return true;
      if (this.currentGame.GetNoDebator() == this.playerIndex) return true;
    },
    pressureLevel: function() {
      if (this.currentGame == null) return 0;
      return this.currentGame.GetPressure(this.playerIndex);
    },
    currentRole: function() {
      if (this.currentGame == null) return "none";
      if (this.playerIndex == -1) return "spectator";
      if (this.currentGame.Moderator() == this.playerIndex) return "moderator";
      if (this.currentGame.GetYesDebator() == this.playerIndex)
        return "debate_yes";
      if (this.currentGame.GetNoDebator() == this.playerIndex)
        return "debate_no";
      if (
        this.currentGame.GetState() == "voting" ||
        this.currentGame.GetState() == "debating"
      )
        return "voter";
      return "";
    },
    currentRoleFriendly: function() {
      if (this.currentGame == null) return "Nothing";
      if (this.playerIndex == -1) return "a Spectator";
      if (this.currentGame.Moderator() == this.playerIndex)
        return "The Moderator";
      if (this.currentGame.GetYesDebator() == this.playerIndex || this.currentGame.GetNoDebator() == this.playerIndex)
        return "Debating";
      if (
        this.currentGame.GetState() == "voting" ||
        this.currentGame.GetState() == "debating"
      )
        return "a Voter";
      return "";
    },
    topic: function() {
      if (this.currentGame == null) return [];
      return this.currentGame.GetTopic();
    },
    YesDebatorName: function() {
      if (this.currentGame == null) return [];
      var playerIndex = this.currentGame.GetYesDebator();
      if (playerIndex == -1) return "";
      var players = this.currentGame.GetPlayers();
      return players[playerIndex];
    },
    NoDebatorName: function() {
      if (this.currentGame == null) return [];
      var playerIndex = this.currentGame.GetNoDebator();
      if (playerIndex == -1) return "";
      var players = this.currentGame.GetPlayers();
      return players[playerIndex];
    }
  },
  methods: {
    StartGame: function() {
      this.currentGame.replicated.StartGame();
    },
    PickedDebators: function(yes, no) {
      console.log("Setting the debators ", yes, no);
      this.currentGame.replicated.SetDebaters(yes, no);
    },
    PickedTopic: function(topic) {
      console.log("Setting the topic", topic);
      this.currentGame.replicated.SetTopic(topic);
    },
    DebatorReady: function() {
      console.log("I'm ready");
      this.currentGame.replicated.SetDebatorReady(this.playerIndex);
    },
    DebateFinished: function() {
      this.currentGame.replicated.FinishDebate();
    },
    Voted: function(vote) {
      console.log("I voted", vote);
      this.currentGame.replicated.SetVote(this.playerIndex, vote.toLowerCase());
    },
    JoinGame: function(gameRoom, playerName) {
      if (gameRoom == undefined) gameRoom = this.gameRoom;
      if (playerName == undefined) playerName = this.playerName;
      if (playerName == "") return;
      this.$socket.emit(ROOT + "join game", gameRoom, playerName);
    },
    RejoinGame: function(gameRoom, playerName, playerIndex, socketId) {
      console.log("Attempting to rejoin the game!");
      this.$socket.emit(
        ROOT + "rejoin game",
        gameRoom,
        playerName,
        playerIndex,
        socketId
      );
    },
    LeaveGame: function() {
      this.$router.push("/argue");
    }
  },
  sockets: {
    connect: function() {
      var gameRoom = this.gameRoom;
      console.log("socket connected for room " + gameRoom);
      this.connected = true;
      this.$socket.emit(ROOT + "connect");
      this.$socket.emit(ROOT + "sync game", gameRoom);
      var self = this;
      const game = ArgueGame.CreateGame(gameRoom, function(name, args) {
        console.log(
          "Broadcast up to the server that we called this ",
          name,
          args
        );
        self.$socket.emit(ROOT + "engine call", gameRoom, name, args);
      });
      this.currentGame = game;

      var previousGame = null;
      if (localStorage.getItem(gameRoom) && this.playerIndex == -1) {
        previousGame = JSON.parse(localStorage.getItem(gameRoom));
        console.log(this);
        this.RejoinGame(
          gameRoom,
          previousGame.playerName,
          previousGame.index,
          previousGame.socketId
        );
        localStorage.removeItem(gameRoom);
      }
      console.log("Previous game", previousGame);
    },
    "Argue:error": function(message, leave) {
      alert(message + leave);
      if (leave != undefined && leave == true) {
        console.log("Leaving game");
        LeaveGame();
      }
    },
    "Argue:set player": function(playerIndex) {
      console.log("Player ID" + playerIndex);
      //TODO do this better
      this.playerIndex = playerIndex;
      localStorage.setItem(
        this.gameRoom,
        JSON.stringify({
          playerName: this.playerName,
          index: this.playerIndex,
          socketId: this.$socket.id
        })
      );
    },
    "Argue:engine call": function(data) {
      console.log(
        "We got a response from the server to call our engine with func " +
          data.funcName +
          " from " +
          data.source,
        data
      );
      if (this.$socket.id == data.source) {
        console.log("Ignoring");
      } else this.currentGame.ApplyFunc(data.funcName, data.argList);
    }
  }
};
</script>
<style scoped>
.content {
  /* https://bennettfeely.com/gradients/ */
  background: var(--color1);
  background: -moz-linear-gradient(top, var(--color1) 0%, var(--color5) 100%);
  background: -webkit-gradient(
    left top,
    left bottom,
    color-stop(0%, var(--color5)),
    color-stop(100%, var(--color5))
  );
  background: -webkit-linear-gradient(
    top,
    var(--color1) 0%,
    var(--color5) 100%
  );
  background: -o-linear-gradient(top, var(--color1) 0%, var(--color5) 100%);
  background: -ms-linear-gradient(top, var(--color1) 0%, var(--color5) 100%);
  background: linear-gradient(to bottom, var(--color1) 0%, var(--color5) 100%);
  filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#f85032', endColorstr='#273de6', GradientType=0 );

  /* Set rules to fill background */
  min-height: 100%;
  min-width: 100%;

  /* Set up proportionate scaling */
  width: 100%;
  height: auto;

  /* Set up positioning */
  position: fixed;
  top: 0;
  left: 0;
}

.speech-bubble {
  position: relative;
  background: var(--color4);
  color: white;
  padding: 0.75em;
  text-transform: uppercase;
  margin: 0.5em;
  border-radius: 0.2em;
}
.speech-bubble:after {
  content: "";
  position: absolute;
  left: 0;
  top: 50%;
  width: 0;
  height: 0;
  border: 20px solid transparent;
  border-right-color: #000000;
  border-right-color: var(--color4);
  border-left: 0;
  border-bottom: 0;
  margin-top: -10px;
  margin-left: -20px;
}
</style>

