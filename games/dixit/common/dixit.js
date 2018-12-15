var Random = require("random-js");
//figure out if we are server side?
function isFunction(functionToCheck) {
    return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
}

const MAX_SCORE = 50;

function CreateGame(gameName, proxyCallback) {
    const STATES = Object.freeze({
        "lobby": 1, //before we start a game
        "firstcard": 2, //when the story teller is picking a card
        "allcards": 4, //when everyone else is picking a card
        "voting": 5, //when everyone is voting
        "endgame": 6 //when we start the game
    });
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

        GetTimeOutInMs: function () {
            return this._timeOut;
        },

        GetLastCommandTime: function () {
            return this._lastCommandTime;
        },

        _Transition: function () { //this is the only place that should modify state
            var newState = this._state;
            //Check if we can transition:
            switch (this._state) {
                case STATES.lobby:
                    if (this._players.length >= 3) newState = STATES.firstcard;
                    break;
                case STATES.firstcard:
                    if (this._imagesSelected.length == 1) newState = STATES.allcards;
                    break;
                case STATES.allcards:
                    //Q: if you don't play a card within the time frame, one will be played for you?
                    if (this._imagesSelected.length >= 6 || this._imagesSelected.length == this._players.length)
                        newState = STATES.voting;
                    break;
                case STATES.voting:
                    //Q: if you don't vote within the right timeframe, then you will be booted?
                    if (this._votes.length == this._players.length) {
                        newState = STATES.firstcard;
                        var maxScore = Math.max(...this._points);
                        if (maxScore >= MAX_SCORE) newState = STATES.endgame;
                    }
                    break;
                case STATES.endgame:
                    //we can't leave the end game state
                default:
            }
            //call our transition handler
            this._OnTransition(this._state, newState);
            this._state = newState;
        },
        _OnTransition: function (oldState, newState) {

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
                    break;
            }
        },

        //Methods you can use to manipulate game state
        AddPlayer: function(playerName) {
            index = this._players.indexOf(playerName);
            if (index != -1) return "This player has already joined";
            this._players.push(playerName);
            return 0;
        },
        RemovePlayer: function(playerName) {
            index = this._players.indexOf(playerName);
            if (index == -1) return "This player has not joined";
            if (this._state == STATES.voting) return "You cannot remove a player during voting";
            this._players.splice(index,1);
            this._votes.splice(index,1);
            this._points.splice(index,1);
            this._timesJudged.splice(index,1);
            return 0;
        },
        AddPad: function() {
            this._padViewers ++;
        },
        RemovePad: function() {
            this._padViewers --;
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
    return default_game;

}

module.exports = {
    CreateGame
};