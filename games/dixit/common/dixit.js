var Random = require("random-js");
//figure out if we are server side?
function isFunction(functionToCheck) {
    return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
}

const STATES = Object.freeze({
    "lobby": 1, //before we start a game
    "firstcard": 2, //when the story teller is picking a card
    "allcards": 4, //when everyone else is picking a card
    "voting": 5, //when everyone is voting
    "endgame": 6 //when we start the game
});

const MAX_SCORE = 30;



function CreateGame(gameName, proxyCallback) {

    var default_game = { //python style
        _gameName: gameName || "DEFAULT",
        _state: STATES.lobby,
        _players: [], //an array of how many players there are
        _padViewers: 0, //how many ipads we have
        _storyteller: -1,
        _points: [],
        _imagesSelected: [],
        _timesStoryTeller: [], //an array of how many times each player has storytellered
        _votes: [],
        _round: 0,
        _mt: null,
        _lastCommandTime: 0,
        _timeOut: -1,

        GetPadAttached: function () {
            return this._padViewers > 0;
        },

        GetState: function () {
            var state = this._state;
            var key = Object.keys(STATES).find(k => STATES[k] === state);
            if (key == undefined) return this._state;
            return key;
        },

        GetScores: function () {
            return this._points;
        },

        GetVoteCardList: function () { //gets a list of the cards you can pick
            return this._imagesSelected.filter(x => x != -1);
        },

        GetTimeOutInMs: function () {
            return this._timeOut;
        },

        GetLastCommandTime: function () {
            return this._lastCommandTime;
        },

        GetPlayers() {
            return this._players;
        },
        GetStoryTeller() {
            return this._storyteller;
        },

        _Transition: function () { //this is the only place that should modify state
            var newState = this._state;
            //Check if we can transition:
            switch (this._state) {
                case STATES.lobby:
                    if (this._players.length >= 3) newState = STATES.firstcard;
                    break;
                case STATES.firstcard:
                    if (this._imagesSelected[this.storytellerIndex] != -1) newState = STATES.allcards;
                    break;
                case STATES.allcards:
                    var selectedCards = this._imagesSelected.filter(x => x != -1); //get the cards that have been picked
                    //Q: if you don't play a card within the time frame, one will be played for you?
                    if (selectedCards.length >= 5 || selectedCards.length == this._players.length)
                        newState = STATES.voting;
                    break;
                case STATES.voting:
                    //Q: if you don't vote within the right timeframe, then you will be booted?
                    var votes = this._votes.filter(x => x != -1); //get the cards that have been picked
                    if (votes.length == this._players.length - 1) { //we let everyone the chance to vote
                        newState = STATES.firstcard;
                        var maxScore = Math.max(...this._points);
                        if (maxScore >= MAX_SCORE) newState = STATES.endgame;
                    }
                    break;
                case STATES.endgame:
                    //we can't leave the end game state
                    break;
                default:
            }
            //call our transition handler
            if (this._state != newState) this._OnTransition(this._state, newState);
            this._state = newState;
        },

        _OnTransition: function (oldState, newState) {
            console.log("Transition from " + oldState + " to " + newState);
            switch (oldState) {
                case STATES.lobby:
                    //set the timesJudged array
                    while (this._timesStoryTeller.length < this._players.length) this._timesStoryTeller.push(0);
                    //set the points array
                    while (this._points.length < this._players.length) this._points.push(0);
                    //sets up the votes
                    while (this._votes.length < this._players.length) this._votes.push(-1);
                    //set up mt random seed
                    break;
                case STATES.voting:
                    //tally up the scores
                    var correctCard = this._imagesSelected[this._storyteller];
                    var correctGuessers = this._votes.filter(x => x == correctCard).length;
                    var numGuessers = this._players.length - 1;
                    //everyone guessed correctly or no one guessed correctly
                    if (correctGuessers == numGuessers || correctGuessers == 0) {
                        //everybody but the story teller gets 2 points
                        for (var i = 0; i < this._players.length; i++) {
                            if (i == this._storyteller) continue;
                            this._points.splice(i, 1, this._points[i] + 2);
                        }
                    } else {
                        //everybody who guessed correctly gets 3 points
                        for (var i = 0; i < this._players.length; i++) {
                            if (i == this._storyteller || this._votes[i] == correctCard)
                                this._points.splice(i, 1, this._points[i] + 3);
                        }
                    }

                    //distributes points for everyone that guessed your card
                    for (var i = 0; i < this._votes.length; i++) {
                        if (i == this._storyteller) continue;
                        //figure out playerindex of which card you guessed
                        var cardVotedFor = this._votes[i];
                        if (cardVotedFor == -1) continue;
                        var cardPlayedBy = this._imagesSelected.indexOf(cardVotedFor);
                        if (cardPlayedBy == -1) {
                            console.error("We didn't find the card: ", cardVotedFor, this._imagesSelected, this._votes);
                            continue;
                        }
                        if (cardPlayedBy >= this._players.length) {
                            //played by a random player
                            console.log("You picked a card that was played by the computer");
                            continue;
                        }
                        //give one point to the player that played this card
                        if (cardPlayedBy != this._storyteller)
                            this._points.splice(cardPlayedBy, 1, this._points[cardPlayedBy] + 1);
                    }

                    // increment the story teller piece of the puzzle
                    this._timesStoryTeller[this._storyteller]++;
                    this._storyteller = -1;

                    break;
            }
            switch (newState) {
                case STATES.firstcard:
                    //pick a new storyteller
                    var leastJudged = Math.min(...this._timesStoryTeller); //get the number that we are least storytellerd
                    var storytellerIndex = this._timesStoryTeller.indexOf(leastJudged);
                    console.log("New storyteller is " + storytellerIndex)
                    this._storyteller = storytellerIndex;
                    //resets the votes
                    for (var i = 0; i < this._votes.length; i++) this._votes[i] = -1; //this would be better with a map but eh
                    //resets the imagesSelected
                    this._imagesSelected.splice(0, this._imagesSelected.length);
                    while (this._imagesSelected.length < this._players.length) this._imagesSelected.push(-1);
                    break;
                case STATES.allcards:
                    break;
                case STATES.voting:
                    //fill in random cards until we have 6 cards
                    while (this._imagesSelected.filter(x => x != -1).length < 6) {
                        //add random cards to the end?
                        this._imagesSelected.push(this._imagesSelected.length + 15);
                    }
                    break;
            }
        },

        //Methods you can use to manipulate game state
        AddPlayer: function (playerName) {
            index = this._players.indexOf(playerName);
            if (index != -1) return "This player has already joined";
            this._players.push(playerName);
            return 0;
        },
        RemovePlayer: function (playerName) {
            index = this._players.indexOf(playerName);
            if (index == -1) return "This player has not joined";
            if (this._state == STATES.voting) return "You cannot remove a player during voting";
            this._players.splice(index, 1);
            this._votes.splice(index, 1);
            this._points.splice(index, 1);
            this._timesJudged.splice(index, 1);
            return 0;
        },
        AddPad: function () {
            this._padViewers++;
            return 0;
        },
        RemovePad: function () {
            this._padViewers--;
            return 0;
        },

        StartGame() {
            console.log("Starting game");
            this._Transition();
            return 0;
        },

        PickCard(playerIndex, cardId) {
            if (cardId < 0) return "Bad Card ID";
            //choose depending on state
            if (this._state == STATES.firstcard) {
                if (playerIndex != this._storyteller) return "You are not the story teller";
                this._imagesSelected[playerIndex] = cardId;
            } else if (this._state == STATES.allcards) {
                if (playerIndex == this._storyteller) return "The story teller cannot pick another card";
                if (this._imagesSelected[playerIndex] != -1) return "You cannot pick another card";
                this._imagesSelected[playerIndex] = cardId;
            } else {
                return "You cannot pick a card in this state";
            }
            this._Transition();
            return 0;
        },
        VoteCard(playerIndex, voteCardId) {
            if (voteCardId < 0) return "Bad Card ID";
            //choose depending on state
            if (this._state == STATES.voting) {
                if (playerIndex == this._storyteller) return "The story teller cannot vote on a card";
                if (this._votes[playerIndex] != -1) return "You cannot vote on another card";
                this._votes[playerIndex] = voteCardId;
            } else {
                return "You cannot vote on a card in this state";
            }
            this._Transition();
            return 0;
        },


        // Replication stuff

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
        ApplyFunc: function (name, args, time) {
            if (this.hasOwnProperty(name)) {
                console.log("Calling " + name + " with ", args);
                this._lastCommandTime = time;
                return this[name].apply(this, args);
            } else {
                return "This call " + name + " does not exist";
            }
        },
        StoreCall: function (callObj) {
            if (this.commands != null) this.commands.push(callObj);
        },
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
    return default_game;

}

module.exports = {
    CreateGame,
    STATES
};