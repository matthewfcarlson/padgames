"use strict";
var StateMachine = require('javascript-state-machine');
var Random = require("random-js");
//figure out if we are server side?
function isFunction(functionToCheck) {
    return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
}

function CreateGame(gameName, proxyCallback) {

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
        transitions: [{
            name: 'start',
            from: 'lobby',
            to: 'first_mod'
        },
        {
            name: 'firstModerateDone',
            from: 'first_mod',
            to: 'moderate_topic'
        },
        {
            name: 'topicPick',
            from: 'moderate_topic',
            to: 'debate_waiting'
        },
        {
            name: 'debateStart',
            from: 'debate_waiting',
            to: 'debating'
        },
        {
            name: 'debateEnd',
            from: 'debating',
            to: 'voting'
        },
        {
            name: 'votingEnd',
            from: 'voting',
            to: 'vote_end'
        },
        {
            name: 'newDebate',
            from: 'vote_end',
            to: 'moderate_topic'
        },
        {
            name: 'finishGame',
            from: 'vote_end',
            to: 'end_game'
        },
        {
            name: 'endGame',
            from: 'moderate_topic',
            to: 'end_game'
        }
        ],
        methods: {
            onTransition: function (lifecycle) {
                if (transitionFunction != null) transitionFunction(lifecycle)
            },
            onInvalidTransition: function (transition, from, to) {
                console.error("ERROR: transition not allowed from " + from + " to " + to);
            }
        }
    });

    var default_game = { //python style
        _state: fsm,
        _gameName: gameName || "DEFAULT",
        _players: [],
        _moderator: -1,
        _debaters: [],
        _pressure: [], //0 = no pressure, 1 = under pressure, 2 = out of the game
        _topic: "",
        _votes: [],
        _round: 0,
        _mt: null,
        _lastModeratedRound: [],
        _debatePairs: [],
        _readyDebators: [],
        _lastCommandTime: 0,
        _timeOut: -1,

        //Sets a callback for transitions in state
        SetTransition: function (trans) {
            transitionFunction = trans;
        },

        GetTimeOutInMs: function(){
            return this._timeOut;
        },

        GetLastCommandTime: function(){
            return this._lastCommandTime;
        },

        //set the debaters (yes is always first)
        SetDebaters: function (player1, player2) {
            if (!this._state.is("first_mod")) {
                return "You can't manually set the debaters if you're not in the first_mod"
            }
            if (player1 == player2) return "You cannot debate yourself";
            if (player1 < 0) return "Invalid debator 1";
            if (player2 < 0) return "Invalid debator 2";
            this._debaters = [player1, player2];
            this._readyDebators.splice(0, this._readyDebators.length);
            this._debatePairs.push(this._debaters);
            this._state.firstModerateDone();
            this._DidExecuteCommand();
            return 0;
        },

        //set the next debaters
        _SetNextDebaters: function () {
            if (!this._state.is("vote_end")) {
                return "You can't manually set the debaters if you're not in the first_mod"
            }
            //figure out who all is still in the game
            var arrayList = this.GetAvailablePlayerIndexs();
            console.log("Setting next debators ", arrayList);
            //go through all the eligible players
            var self = this;
            var timesDebated = arrayList.map(x => {
                //figure out how many times this person has been in a debate
                return self._debatePairs.reduce((prev, curr) => {
                    if (curr.indexOf(x) != -1) return prev + 1;
                    return prev;
                }, 0);
            });
            console.log("Number of times they've debated", timesDebated);
            var debator1 = -1;
            var debator2 = -1;
            var minTimesDebated = 999;
            timesDebated.forEach((curr, index) => {
                if (curr < minTimesDebated) {
                    debator1 = index;
                    minTimesDebated = curr;
                }
            });
            var minTimesDebated = 999;
            timesDebated.forEach((curr, index) => {
                if (curr < minTimesDebated && index != debator1) {
                    debator2 = index;
                    minTimesDebated = curr;
                }
            });

            if (debator1 == -1 || debator2 == -1) {
                console.log("We have a winner!", debator1, debator2);
                console.log("State ", this.GetState());
                return "winner";
            }

            console.log("Possible debators indexs: ", debator1, debator2);

            //convert back to the origional debator index format
            debator1 = arrayList[debator1];
            debator2 = arrayList[debator2];

            console.log("Possible debators: ", debator1, debator2);
            var debators = [debator1, debator2];
            //Check to make sure this configuration doesn't exist
            if (this._debatePairs.indexOf(debators) != -1) {
                debators = [debator2, debator1];
            }

            if (this._debatePairs.indexOf(debators) != -1) {
                debators = [debator1, debator2];
            }


            this._debaters = debators;
            this._readyDebators.splice(0, this._readyDebators.length);
            this._debatePairs.push(this._debaters);

            return 0;

        },

        SetDebatorReady: function (playerIndex) {
            //TODO set a timer that will go off
            if (!this._state.is("debate_waiting")) return "We are not in the right state for the debators to mark ready";
            if (this._readyDebators.indexOf(playerIndex) != -1) return "This debator player is already ready" + playerIndex;
            this._readyDebators.push(playerIndex);
            if (this._readyDebators.length >= 2) {
                var currentTime = this._GetCurrentTime();
                var elapsedTime = currentTime - this._lastCommandTime;
                var timeoutTime = 120 * 1000;
                if (elapsedTime > 0){
                    timeoutTime =  timeoutTime - elapsedTime;
                }
                if (timeoutTime <= 0) timeoutTime = 1;
                this._timeOut = timeoutTime;
                this._state.debateStart();
            }
            this._DidExecuteCommand();
            return 0;
        },



        FinishDebate: function () {
            if (!this._state.is("debating")) return "We are not in the right state for the debate to finish";
            //TODO check if enough time has elapsed?
            this._state.debateEnd();
            this._DidExecuteCommand();
            return 0;
        },

        GetGameWinner: function () {
            var winner = -1;
            var numWinners = 0;
            this._pressure.forEach((x, index) => {
                if (x < 2 && x >= 0) {
                    winner = index;
                    numWinners++;
                }
            });
            if (numWinners != 1) return -1;
            return winner;
        },

        SetVote: function (playerIndex, vote) {
            console.log(this._votes);
            if (!this._state.is("voting")) return "We are not in the right state for the debate to finish";
            if (this._votes[playerIndex] != "") return "You have already voted";
            if (vote != "yes" && vote != "no") return "Invalid vote value";
            if (this.GetYesDebator() == playerIndex) return "You cannot vote when you're a debator";
            if (this.GetNoDebator() == playerIndex) return "You cannot vote when you're a debator";

            this._votes[playerIndex] = vote;

            if (this.GetWinner() >= 0) {
                //end the debate
                console.log("Ending the debate");
                this._state.votingEnd();
                this.SetupNextRound();
            }
            this._DidExecuteCommand();
            return 0;
        },

        _GetNextModerator: function () {
            //figure out who all is still in the game
            var self = this;
            var moderatorIndexs = this._players.map((x, i) => i).filter(x => self._pressure[x] >= 2);
            var leastIndex = -1;
            var leastValue = 99999;
            var moderatorIndex = -1;
            console.log("Eliminated players ", moderatorIndexs)
            //preference is given to those that are out
            moderatorIndexs.forEach((x) => {
                if (self._lastModeratedRound[x] < leastValue) {
                    leastValue = self._lastModeratedRound[x];
                    leastIndex = x;
                }
            });
            console.log("leastIndex", leastIndex);
            if (leastIndex != -1) moderatorIndex = leastIndex;
            else {
                moderatorIndexs = this._players.map((x, i) => i);
                leastIndex = -1;
                leastValue = 9999;
                //preference is given to those that are out
                moderatorIndexs.forEach(x => {
                    if (self._lastModeratedRound[x] < leastValue) {
                        leastValue = self._lastModeratedRound[x];
                        leastIndex = x;
                    }
                });
                moderatorIndex = leastIndex;
            }

            console.log("New moderator: ", moderatorIndex);
            //update the last moderated round to this round
            console.log("Setting round to: ", this._round);
            this._lastModeratedRound[moderatorIndex] = this._round;

            return moderatorIndex;
        },

        SetupNextRound: function () {
            console.log("Setting up next round");
            //add points
            var winner = this.GetWinner();
            var loserIndex = this.GetNoDebator();
            if (winner == loserIndex) loserIndex = this.GetYesDebator();
            //console.log("loser is ", loserIndex);
            this._pressure[loserIndex]++;
            this._pressure.push(-1); //try to mess with the reactive system
            this._pressure.pop();
            //console.log("Pressure", this._pressure);
            this._topic = "";
            this._votes = this._players.map(x => ""); //set them all to empty strings
            this._debaters.splice(0, this._debaters.length);
            this._round++;

            if (this.GetGameWinner() != -1) {
                console.log("Game is over");
                this._moderator = -1;
                this._debaters = [];
                this._state.finishGame();
            } else {
                //pick a new moderator
                this._moderator = this._GetNextModerator();
                console.log("New Moderator: ", this._moderator);
                //pick new debators
                this._SetNextDebaters();
                //start the new debate
                this._state.newDebate();
            }
        },

        GetWinner: function () {
            var yes = 0;
            var no = 0;
            var unanswered = this._players.length - 2; //there's always two debators
            if (!this._state.is("vote_end") && !this._state.is("voting")) return "A debate is not ready";


            for (var i = 0; i < this._votes.length; i++) {
                var value = this._votes[i];
                if (value == "") continue;
                unanswered--;
                if (value == "yes") yes++;
                if (value == "no") no++;

            }
            if (unanswered != 0) return -1;
            if (yes > no) return this.GetYesDebator();
            if (no > yes) return this.GetNoDebator();


            //there's a tie
            var moderatorVote = this._votes[this._moderator];
            console.log("The moderator voted tie-breaker", moderatorVote);
            if (moderatorVote == "yes") yes++;
            if (moderatorVote == "no") no++;
            if (yes > no) return this.GetYesDebator();
            if (no > yes) return this.GetNoDebator();
        },

        GenCallObj: function (source, callName, args) {
            var date = new Date();
            var current_time = date.getTime();
            return {
                source: source,
                funcName: callName,
                argList: args,
                time: current_time
            }
        },

        StoreCall: function (callObj) {
            if (this.commands != null) this.commands.push(callObj);
        },

        GetLastCommandTime: function () {
            if (this.commands != null) {
                var last_index = this.commands.length - 1;
                var last_command = this.commands[last_index];
                return last_command.time;
            }
            return 0;
        },

        //Sets the topic of the particular session
        SetTopic: function (topic) {
            if (this._state.is("moderate_topic")) {
                //set the topic to be picked
                this._topic = topic;
                this._state.topicPick();
                var self = this;

                var currentTime = this._GetCurrentTime();
                var elapsedTime = currentTime - this._lastCommandTime;
                var timeoutTime = 45 * 1000;
                if (elapsedTime > 0){
                    timeoutTime =  timeoutTime - elapsedTime;
                }
                
                if (timeoutTime <= 0) timeoutTime = 1;
                this._timeOut = timeoutTime;

                console.log("We got this ", this._lastCommandTime, currentTime, elapsedTime);
                console.log("Time left", timeoutTime);
                
                setTimeout(function () {
                    console.log("TIMES UP - DEBATORS Prep time is up!"); //, self);
                    if (self._state.is("moderate_topic")) {
                        self.SetDebatorReady(self.GetNoDebator());
                        self.SetDebatorReady(self.GetYesDebator());
                        self.StoreCall(self.GenCallObj(
                            "Server", "SetDebatorReady", [self.GetNoDebator()]
                        ));
                        self.StoreCall(self.GenCallObj(
                            "Server", "SetDebatorReady", [self.GetYesDebator()]
                        ));
                    }
                }, timeoutTime);
                this._DidExecuteCommand();
                return 0;
            } else {
                return "Topic cannot be set in this state"
            }
        },

        GetTopic: function () {
            return this._topic;
        },

        //Gets the debator that is for the issue
        GetYesDebator: function () {
            if (this._debaters.length == 0) return -1;
            return this._debaters[0];
        },

        GetPressure: function (index) {
            if (this._pressure.length <= index) return 0;
            return this._pressure[index];
        },

        //Gets the debator that is against the issue
        GetNoDebator: function () {
            if (this._debaters.length == 0) return -1;
            return this._debaters[1];
        },

        //Get the list of players
        GetPlayers: function () {
            return this._players
        },

        GetAvailablePlayerIndexs: function () {
            if (this._players.length == 0) return [];
            const moderator = this._moderator;
            var self = this;
            //filter out the players that are out of the game
            var availablePlayers = this._players.map((x, index) => index).filter(function (val, index) {
                if (index == moderator) return false;
                if (self._pressure[index] >= 2) return false;
                return true;
            });
            console.log("Players you can pick: ", availablePlayers)
            return availablePlayers;
        },

        //Gets the current moderator
        Moderator: function () {
            return this._moderator;
        },

        //Gets the current state
        GetState: function () {
            return this._state.state;
        },

        GetReadyDebators: function () {
            return this._readyDebators;
        },

        //Adds a player to the game
        AddPlayer: function (name) {
            if (name == null) return "Malformed name";
            if (!(typeof name === 'string')) {
                name = String(name);
            }
            if (name == null) return "Malformed name";
            name = name.trim();
            if (!this._state.is("lobby")) return "The game has already started";
            if (this._players.indexOf(name) != -1) return "You cannot join the same game twice";
            this._players.push(name)
            this._DidExecuteCommand();
            return 0;
        },
        //Ends the game
        EndGame: function () {
            this._state.endgame();
            this._DidExecuteCommand();
            return 0;
        },

        //starts the game, you must have three players
        StartGame: function () {
            //check if we can start

            if (this._players.length < 3) return "You need 3 players before you can start the game"
            if (this._state.cannot("start")) return "You cannot start the game";
            console.log("Starting the game");
            while (this._players.length > this._pressure.length) this._pressure.push(0);
            while (this._players.length > this._votes.length) this._votes.push("");
            while (this._players.length > this._lastModeratedRound.length) this._lastModeratedRound.push(-1);
            console.log(this._votes);
            this._state.start();
            this._moderator = this.GetRandomNumber(0, this._players.length - 1);
            this._lastModeratedRound[this._moderator] = 0;
            this._DidExecuteCommand();
            return 0;
        },

        _DidExecuteCommand: function () {
            var current_time = this._GetCurrentTime();
            this._lastCommandTime = current_time;
        },
        _GetCurrentTime: function () {
            var date = new Date();
            var current_time = date.getTime();
            return current_time;
        },

        ApplyFunc: function (name, args, time) {
            if (this.hasOwnProperty(name)) {
                console.log("Calling " + name + " with ", args);
                this._lastCommandTime = time;
                return this[name].apply(this, args);
            } else {
                return "This call " + name + " does not exist";
            }
        },

        //Gets a random number
        GetRandomNumber: function (min, max) {
            if (this._mt == null) {
                var hashCode = function (s) {
                    return s.split("").reduce(function (a, b) {
                        a = ((a << 5) - a) + b.charCodeAt(0);
                        return a & a
                    }, 0);
                }
                var mt = Random.engines.mt19937();
                mt.seed(hashCode(this._gameName)); //TODO FIGURE OUT HOW TO 
                this._mt = mt;
                //console.log("Seeding with",hashCode(this._gameName));
            }
            var val = Random.integer(min, max)(this._mt);
            //console.log("Returning value",val);
            return val;
        }



    };

    if (proxyCallback == undefined) {
        proxyCallback = function (name, ...args) {
            console.log(name + " was called with " + args);
        };
    }

    function ConvertFunction(context, func) {
        return function (...recievedArgs) {
            proxyCallback(func.name, recievedArgs);
            return func.apply(context, recievedArgs);
        }
    }

    default_game.replicated = {};
    for (var key in default_game) {

        if (isFunction(default_game[key])) {
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