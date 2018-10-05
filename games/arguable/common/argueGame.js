"use strict";
var StateMachine = require('javascript-state-machine');
var Random = require("random-js");
//figure out if we are server side?
function isFunction(functionToCheck) {
    return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
}

function CreateGame(gameName, proxyCallback){

    //We start in lobby and go to first_mod (first moderator)
    // -> Going to first_moderator we pick the first_moderator 
    //  First_moderator
    // -> We ask who they want to debate and then ask the first moderator to pick them yes or no
    // Moderate_topic
    // -> We ask what topic they want to debate -> this is client side
    // Debate_Waiting
    // -> we give each player their topics and wait for the moderator to start the timer
    //Debating
    // -> We are running the timer down
    //Voting
    // -> We wait for each player to vote
    // -> Moderator can override
    //End_vote
    // -> New debaters are chosen new moderate is chosen. Losing player is now moderator.
    // -> If more than one player left, We automatically move to Moderate_topic
    // -> Otherwise we end the game
    //End_game
    
    var transitionFunction = null;
    var fsm = new StateMachine({
        init: 'lobby',
        transitions: [
          { name: 'start',    from: 'lobby',  to: 'first_mod' },
          { name: 'firstModerateDone',  from: 'first_mod',  to: 'moderate_topic' },
          { name: 'topicPick',  from: 'moderate_topic',  to: 'debate_waiting' },
          { name: 'debateStart',  from: 'debate_waiting',  to: 'debating' },
          { name: 'debateEnd',  from: 'debating',  to: 'voting' },
          { name: 'votingEnd',  from: 'voting',  to: 'vote_end' },
          { name: 'newDebate',  from: 'vote_end',  to: 'topicPick' },
          { name: 'finishGame',  from: 'vote_end',  to: 'end_game' },
          { name: 'endGame', from: 'moderate_topic',    to: 'end_game' }
        ],
        methods: {
          onStart: function() { console.log('I start'); },
          onEndGame: function() { console.log('I ended the hame') },
          onTransition: function(lifecycle) { if (transitionFunction != null) transitionFunction(lifecycle) },
          onInvalidTransition: function(transition, from, to) {
            throw new Exception("transition not allowed from that state");
          }
        }
      });
    
    var default_game =  {  //python style
        _state: fsm,
        _gameName: gameName || "DEFAULT",
        _players: [],
        _answers: [],
        _moderator: -1,
        _debaters: [],
        _pressure: [], //0 = no pressure, 1 = under pressure, 2 = out of the game
        _topic: "",
        _mt: null,

        //Sets a callback for transitions in state
        SetTransition: function(trans){
            transitionFunction = trans;
        },

        //set the debaters (yes is always first)
        SetDebaters: function(player1, player2){
            if (!this._state.is("first_mod")){
                return "You can't manually set the debaters if you're not in the first_mod"
            }
            if (player1 == player2) return "You cannot debate yourself";
            if (player1 < 0) return "Invalid debator 1";
            if (player2 < 0) return "Invalid debator 2";
            this._debaters = [player1, player2];
            this._readyDebators = [];
            this._state.firstModerateDone()
            return 0;
        },

        //set the next debaters
        SetNextDebaters: function(){
            if (!this._state.is("first_mod")){
                return "You can't manually set the debaters if you're not in the first_mod"
            }
            //figure out who all is still in the game
            arrayList = this._pressure.map(function(x,index){ (x<2) ? x:-1}).filter(x => x != -1);
            console.log("Setting next debators ",arrayList);

            //pick two moderators that haven't faced off before if possible
            return 0;

        },

        SetDebatorReady: function(playerIndex){
            //TODO set a timer that will go off
            if (!this._state.is("debate_waiting")) return "We are not in the right state for the debators to mark ready";
            if (this._readyDebators.indexOf(playerIndex) != -1) return "This debator player is already ready" + playerIndex;
            this._readyDebators.push(playerIndex);
            if (this._readyDebators.length >= 2){
                this._state.debateStart();
            }
            return 0;
        },

        FinishDebate: function(){
            if (!this._state.is("debating")) return "We are not in the right state for the debate to finish";
            //TODO check if enough time has elapsed?
            this._state.debateEnd();
            return 0;
        },

        GenCallObj: function(source, callName,args){
            return {source:source,funcName:callName,argList:args}
        },

        StoreCall: function(callObj){
            this.commands.push(callObj);
        },

        //Sets the topic of the particular session
        SetTopic: function(topic){
            if (this._state.is("moderate_topic")){
                //set the topic to be picked
                this._topic = topic;
                this._state.topicPick();
                var self = this;
                setTimeout(function(){
                    console.log("TIMES UP - DEBATORS Prep time is up!",self);
                    self.SetDebatorReady(self.GetNoDebator());
                    self.SetDebatorReady(self.GetYesDebator());
                    self.StoreCall(self.GenCallObj(
                        "Server","SetDebatorReady",[self.GetNoDebator()]
                    ));
                    self.StoreCall(self.GenCallObj(
                        "Server","SetDebatorReady",[self.GetYesDebator()]
                    ));
                },45*1000);
                return 0;
            }
            else {
                return "Topic cannot be set in this state"
            }
        },

        GetTopic: function(){
            return this._topic;
        },

        //Gets the debator that is for the issue
        GetYesDebator: function(){
            if (this._debaters.length == 0) return -1;
            return this._debaters[0];
        },

        //Gets the debator that is against the issue
        GetNoDebator: function(){
            if (this._debaters.length == 0) return -1;
            return this._debaters[1];
        },

        //Get the list of players
        GetPlayers: function(){
            return this._players
        },

        GetAvailablePlayerIndexs: function(){
            if (this._players.length == 0) return [];
            const moderator = this._moderator;
            //filter out the players that are out of the game
            var availablePlayers = this._players.map((x,index)=>index).filter(function(val,index){
                if (index == moderator) return false;
                return true;
            });
            console.log("Players you can pick: ",availablePlayers)
            return availablePlayers;
        },

        //Gets the current moderator
        Moderator: function(){
            return this._moderator;
        },

        //votes for a specific player
        Vote: function(playerIndex, votedYes){

        },
        
        //Gets the current state
        GetState: function(){
            return this._state.state
        },

        //Adds a player to the game
        AddPlayer: function(name){
            if (name == null) return "Malformed name";
            if (!(typeof name === 'string')){
                name = String(name);
            }
            if (name == null) return "Malformed name";
            name = name.trim();
            if (!this._state.is("lobby")) return "The game has already started";
            if (this._players.indexOf(name) != -1) return "You cannot join the same game twice";
            this._players.push(name)
            return 0;
        },
        //Ends the game
        EndGame: function(){
            this._state.endgame();
            return 0;
        },

        //starts the game, you must have three players
        StartGame: function(){
            //check if we can start
            if (this._players.length < 3) return "You need 3 players before you can start the game"
            if (this._state.cannot("start")) return "You cannot start the game";
            this._state.start();            
            this._moderator = this.GetRandomNumber(0,this._players.length-1);
            return 0;
        },

        ApplyFunc: function (name,args){
            if (this.hasOwnProperty(name)){
                console.log("Calling "+name+" with ",args);
                
                return this[name].apply(this, args);
            }
            else {
                return "This call "+name+" does not exist";
            }
        },

        //Gets a random number
        GetRandomNumber: function(min,max){
            if (this._mt == null) {
                var hashCode = function(s){
                    return s.split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);              
                }
                var mt = Random.engines.mt19937();
                mt.seed(hashCode(this._gameName)); //TODO FIGURE OUT HOW TO 
                this._mt = mt;
                //console.log("Seeding with",hashCode(this._gameName));
            }
            var val = Random.integer(min,max)(this._mt);
            //console.log("Returning value",val);
            return val;
        }

        

    };

    if (proxyCallback == undefined) {
        proxyCallback = function(name, ...args){
            console.log(name+" was called with "+args);
        };
    }

    function ConvertFunction(context, func){
        return function(...recievedArgs){
            proxyCallback(func.name,recievedArgs);
            return func.apply(context,recievedArgs);
        }
    }

    default_game.replicated = {};
    for (var key in default_game) {
        
        if (isFunction(default_game[key])){
            var hiddenFunc = default_game[key];
            default_game.replicated[key] = ConvertFunction(default_game, hiddenFunc);
        } 
    }
    /*
    for (var key in default_game) {
        
        if (isFunction(default_game[key])){
            default_game[key+"_hidden"] = default_game[key];
            var hiddenFunc = default_game[key+"_hidden"];
            default_game[key] = ConvertFunction(default_game, hiddenFunc);
        } 
    }
    */

    return default_game;

}

module.exports = {
    CreateGame
}