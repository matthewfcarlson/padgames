<template>
<div class="content" v-bind:class="{ 'content-moderator': isModerator, 'content-debate-yes': currentRole == 'debate_yes', 'content-debate-no': currentRole == 'debate_no' }">
    <h1 class="speech-bubble"> 
      <div v-if="currentRole != ''">I am {{currentRoleFriendly}}</div>
      <div v-else>Arguable Game</div>
    </h1>
    <div class="lead badge badge-warning " v-if="pressureLevel == 1">Under Pressure!</div>
    <div class="lead badge badge-danger " v-if="pressureLevel == 2">I'm out!</div>
    
    <h2 class="speech-bubble" v-if="topic != ''">
      {{topic}}?
      <hr/>
      <div class="" v-if="YesDebatorName != ''" style="color:black">
        <small class="row">
          <div class="text-yes col-5 text-left"><i class="fas fa-xs fa-user-check" v-if="yesDebatorReady"></i>{{YesDebatorName | uppercase}}</div> 
          <div class="col-2 text-center ">vs</div> 
          <div class="text-no col-5 text-right"><i class="fas fa-xs fa-user-check" v-if="noDebatorReady"></i>{{NoDebatorName | uppercase}} </div>
        </small>
      </div>
    </h2>
    
    <h2 class="speech-bubble speech-bubble-yes" v-if="currentRole == 'debate_yes'">Yes!</h2>
    <h2 class="speech-bubble speech-bubble-no" v-if="currentRole == 'debate_no'">No!</h2>
    <div is="DebatingTimeLimit" v-if="state == 'debating'" @submit="DebateFinished" v-bind:isModerator="isModerator"></div>

   
    <div v-else-if="state == 'lobby'" >
      <div is="LobbyPlayerList" v-bind:players="playerList"></div>
      <br/>
      <div v-if="playerIndex == -1">
        <h3>Join game</h3>
        <input type="text" class="form-control" placeholder="Your name" v-model="playerName" />
        <br/>
        <button class="btn btn-primary btn-block" @click="JoinGame()">Join Game</button>
      </div>
      <button v-else class="btn btn-primary btn-block" @click="StartGame">Start Game</button>
    </div>
    
   
    <div is="ModeratorPickDebator"  v-else-if="isModerator && state == 'first_mod'" @submit="PickedDebators" v-bind:players="playerList" v-bind:avaialble="pickAblePlayerIndexs"></div>
    <div is="ModeratorTopicPick" v-else-if="isModerator && state == 'moderate_topic'" @submit="PickedTopic"></div>
    <div is="DebatorPickStrategies" v-else-if="isDebator && (state == 'debate_waiting'|| state == 'debating')" @submit="DebatorReady"></div>    
    <div is="Voting" v-else-if="!isDebator && state == 'voting'" @submit="Voted"></div>
    <div v-else-if="state == 'end_game'">
      <h2>Game over!</h2>
      The winner is {{winningPlayerName}}

    </div>
    
    <div v-else>
      Waiting...
    </div>

    <pre v-if="currentGame != null && debug">
      {{playerList}}
      {{state}}
      Role: {{currentRole}}
      Moderator: {{moderator}}
      PlayerIndex: {{playerIndex}}
      YES: {{currentGame.GetYesDebator()}} Ready: {{yesDebatorReady}}
      NO: {{currentGame.GetNoDebator()}}  Ready: {{noDebatorReady}}
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
import LobbyPlayerList from "./LobbyPlayerList";
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
    var self = this;
    var gameRoom = this.$route.params.gameID || "";
    var debug =
      location.hostname === "localhost" || location.hostname === "127.0.0.1";
    return {
      currentGame: ArgueGame.CreateGame(gameRoom, function(name, args) {
        console.log(
          "Broadcast up to the server that we called this ",
          name,
          args
        );
        self.$socket.emit(ROOT + "engine call", gameRoom, name, args);
      }),
      count: 0,
      playerIndex: -1,
      playerName: debug ? "Default" : "",
      gameRoom: gameRoom,
      debug: debug
    };
  },
  components: {
    ModeratorPickDebator,
    ModeratorTopicPick,
    DebatorPickStrategies,
    LobbyPlayerList,
    DebatingTimeLimit,
    Voting
  },
  created: function() {
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
    winningPlayerName: function(){
      if (this.currentGame == null) return "";
      var winner = this.currentGame.GetGameWinner();
      if (winner == -1 ) return "";
      return this.playerList[winner];
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
    yesDebatorReady: function() {
      if (this.currentGame == null) return false;
      var ready = this.currentGame.GetReadyDebators();
      var index = this.currentGame.GetYesDebator();
      if (index == -1) return false;
      if (ready.indexOf(index) != -1) return true;
      return false;
    },
    noDebatorReady: function() {
      if (this.currentGame == null) return false;
      var ready = this.currentGame.GetReadyDebators();
      var index = this.currentGame.GetNoDebator();
      if (index == -1) return false;
      if (ready.indexOf(index) != -1) return true;
      return false;
    },
    isModerator: function() {
      if (this.currentGame == null) return [];
      if (this.playerIndex == -1) return false;
      return this.currentGame.Moderator() == this.playerIndex;
    },
    isDebator: function() {
      if (this.currentGame == null) return false;
      if (this.currentGame.GetYesDebator() == this.playerIndex) return true;
      if (this.currentGame.GetNoDebator() == this.playerIndex) return true;
    },
    pressureLevel: function() {
      if (this.currentGame == null) return 0;
      if (this.playerIndex == -1) return 0;
      return this.currentGame.GetPressure(this.playerIndex);
    },
    currentRole: function() {
      if (this.currentGame == null) return "none";
      if (this.playerIndex == -1 && this.currentGame.GetState() != "lobby")
        return "spectator";
      if (this.playerIndex != -1) {
        if (this.currentGame.Moderator() == this.playerIndex)
          return "moderator";
        if (this.currentGame.GetYesDebator() == this.playerIndex)
          return "debate_yes";
        if (this.currentGame.GetNoDebator() == this.playerIndex)
          return "debate_no";
        if (
          this.currentGame.GetState() == "voting" ||
          this.currentGame.GetState() == "debating"
        )
          return "voter";
      }
      return "";
    },
    currentRoleFriendly: function() {
      if (this.currentGame == null) return "Nothing";
      if (this.playerIndex == -1 && this.currentGame.GetState() != "lobby")
        return "a Spectator";
      if (this.playerIndex != -1) {
        if (this.currentGame.Moderator() == this.playerIndex)
          return "The Moderator";
        if (
          this.currentGame.GetYesDebator() == this.playerIndex ||
          this.currentGame.GetNoDebator() == this.playerIndex
        )
          return "Debating";
        if (
          this.currentGame.GetState() == "voting" ||
          this.currentGame.GetState() == "debating"
        )
          return "a Voter";
      }
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
      document.title = "Arguing - " + playerName;
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
      } else {
        this.currentGame.ApplyFunc(data.funcName, data.argList);
        Vue.set(this, "currentGame", this.currentGame);
      }
    }
  }
};
</script>
<style>
html,
body,
:root {
  margin: 0;
  padding: 0;
}
.content-moderator .list-group, 
.content-debate-no .list-group, 
.content-debate-yes .list-group {
  color:black;
}

.btn-yes {
  background: var(--color-yes);
  color:white;
}
.btn-no {
  background: var(--color-no);
  color:white;
}
.text-yes {
  color: var(--color-yes);
}
.text-no {
  color: var(--color-no);
}
</style>
<style scoped>
.content {
  --color-yes: #01afef;
  --color-mod: #18a246;
  --color-no: #ee0181;
  padding-top:0.2em;
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
  min-height: 100vh;
  min-width: 100vw;

  /* Set up proportionate scaling */
  width: 100%;
  height: auto;
}
.content-moderator {
  background: var(--color-mod);
  color: white;
}
.content-debate-yes {
  background: var(--color-yes);
  color: white;
}
.content-debate-no {
  background: var(--color-no);
  color: white;
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

.speech-bubble-no {
  color: var(--color-no);
  background: white;
}
.speech-bubble-no:after,.speech-bubble-yes:after{
  border-right-color: white
}
.speech-bubble-yes {
  color: var(--color-yes);
  background: white;
}
</style>

