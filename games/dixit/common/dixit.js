var Random = require("random-js");
//figure out if we are server side?
function isFunction(functionToCheck) {
    return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
}

var STATES = Object.freeze({
    "lobby": 1, //before we start a game
    "firstcard": 2, //when the story teller is picking a card
    "allcards": 3, //when everyone else is picking a card
    "voting": 4, //when everyone is voting
    "endgame": 5 //when we start the game
});

function CreateGame(gameName, proxyCallback) {
   
    var default_game = { //python style
        _gameName: gameName || "DEFAULT",
        _state: STATES.lobby,
        _players: [],
        _padViewers: 0,
        _judge: -1,
        _points: [],
        _imagesSelected: [],
        _votes: [],
        _round: 0,
        _mt: null,
        _lastCommandTime: 0,
        _timeOut: -1,

        GetState: function() {
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
                case STATES.firstcard:
                case STATES.allcards:
                case STATES.voting:
                case STATES.endgame:
                default:
            }
            this._state = newState;
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