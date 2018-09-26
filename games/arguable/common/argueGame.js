"use strict";
var StateMachine = require('javascript-state-machine');
var Random = require("random-js");

function CreateGame(gameName){

    //We start in lobby and go to first_mod (first moderator)
    // -> Going to first_moderator we pick the first_moderator 
    //  First_moderator
    // -> We ask who they want to debate and then ask the first moderator to pick them yes or no
    var transitionFunction = null;
    var fsm = new StateMachine({
        init: 'lobby',
        transitions: [
          { name: 'Start',    from: 'lobby',  to: 'first_mod' },
          { name: 'EndGame', from: '???',    to: 'end_game' }
        ],
        methods: {
          onStart: function() { console.log('I start'); },
          onEndGame: function() { console.log('I ended the hame') },
          onTransition: function(lifecycle) { if (transitionFunction != null) transitionFunction(lifecycle) }
        }
      });
    
    return {  //python style
        _state: fsm,
        _gameName: gameName || "DEFAULT",
        _players: [],
        _moderator: -1,
        _mt: null,

        SetTransition: function(trans){
            transitionFunction = trans;
        },

        GetPlayers: function(){
            return this._players
        },

        Moderator: function(){
            return this._moderator;
        },
        
        GetState: function(){
            return this._state.state
        },
        AddPlayer: function(name){
            if (name == null) return "Malformed name";
            name = name.trim();
            if (!this._state.is("lobby")) return "The game has already started";
            if (this._players.indexOf(name) != -1) return "You cannot join the same game twice";
            this._players.push(name)
            return 0;
        },
        EndGame: function(){
            this._state.endgame();
            return 0;
        },
        StartGame: function(){
            //check if we can start
            if (this._players.length > 3) return "You need 3 players before you can start the game"
            this._state.start();
            
            this._moderator = this.GetRandomNumber(0,this._players.length-1);
            return 0;
        },
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
}

module.exports = {
    CreateGame
}