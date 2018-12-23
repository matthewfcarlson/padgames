var Random = require("random-js");
var DixitCards = require("./cards");
//figure out if we are server side?
function isFunction(functionToCheck) {
    return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
}
var hashCode = function (s) {
    return s.split("").reduce(function (a, b) {
        a = ((a << 5) - a) + b.charCodeAt(0);
        return a & a
    }, 0);
}

function shuffleArray(array, mt) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Random.integer(0, i)(mt);
        [array[i], array[j]] = [array[j], array[i]];
    }
}

const STATES = Object.freeze({
    "lobby": 1, //before we start a game
    "firstcard": 2, //when the story teller is picking a card
    "allcards": 4, //when everyone else is picking a card
    "voting": 5, //when everyone is voting
    "reveal": 6, // when we reveal who the proper card was
    "endgame": 7, //when we start the game,
    "endearly": 8
});

const MAX_SCORE = 30;
const HAND_LIMT = 5;
const NUM_CARDS = DixitCards.NUM_CARDS;

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
        _hands: [],
        _deck: [],
        _cardsPlayed: [],
        _votes: [],
        _round: 0,
        _mt: null,
        _lastCommandTime: 0,
        _timeOut: -1,
        _handLimit: 0,
        _server: false,

        GetPadAttached: function () {
            return this._padViewers > 0;
        },

        GetPlayerHand: function (index) {
            if (index < 0 || index >= this._players.length) return [];
            return this._hands[index];
        },

        GetVotes: function () {
            if (this._state != STATES.reveal) return [];
            return this._votes;
        },

        GetState: function () {
            var state = this._state;
            var key = Object.keys(STATES).find(k => STATES[k] === state);
            if (key == undefined) return this._state;
            return key;
        },
        GetSelectedCard: function (playerIndex) {
            if (this._imagesSelected.length <= playerIndex) return -1;
            return this._imagesSelected[playerIndex];
        },
        GetNumCorrectGuessers: function () {
            var correctCard = this.GetSelectedCard(this._storyteller);
            return this._votes.filter(x => x == correctCard).length;
        },
        GetPointsEarned: function () {
            var points = [];

            for (var i = 0; i < this._players.length; i++) {
                points.push(0);
            }
            var correctCard = this._imagesSelected[this._storyteller];
            var correctGuessers = this.GetNumCorrectGuessers();
            var numGuessers = this._players.length - 1;

            //everyone guessed correctly or no one guessed correctly
            if (correctGuessers == numGuessers || correctGuessers == 0) {
                //everybody but the story teller gets 2 points
                for (var i = 0; i < this._players.length; i++) {
                    if (i == this._storyteller) continue;
                    points.splice(i, 1, points[i] + 2);
                }
            } else {
                //everybody who guessed correctly gets 3 points
                for (var i = 0; i < this._players.length; i++) {
                    if (i == this._storyteller || this._votes[i] == correctCard)
                        points.splice(i, 1, points[i] + 3);
                }
            }

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
                    //console.log("You picked a card that was played by the computer");
                    continue;
                }
                //give one point to the player that played this card
                if (cardPlayedBy != this._storyteller)
                    points.splice(cardPlayedBy, 1, points[cardPlayedBy] + 1);
            }
            return points;
        },
        GetScores: function () {
            return this._points;
        },
        GetPlayersVoted: function () {
            var votes = this._votes;
            return this._players.map((x, i) => {
                if (i >= votes.length) return false;
                return votes[i] != -1;
            });
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

        _GetCardFromDeck() {
            return this._deck.shift();
        },

        _Transition: function () { //this is the only place that should modify state
            var newState = this._state;
            //Check if we can transition:
            switch (this._state) {
                case STATES.lobby:
                    if (this._players.length >= 3) newState = STATES.firstcard;
                    break;
                case STATES.firstcard:
                    if (this._imagesSelected[this._storyteller] != -1) newState = STATES.allcards;
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
                        //figure out if we are the server or not
                        if (!this._server) {
                            newState = STATES.reveal;
                        } else {
                            newState = STATES.firstcard;
                            //we need to add a finish reveal into our list of actions so if someone syncs later they don't get stuck
                            //TODO: code smell
                            var storedCall = this.GenCallObj("server", "FinishReveal", []);
                            this.StoreCall(storedCall);
                        }
                        var maxScore = Math.max(...this._points);
                        if (maxScore >= MAX_SCORE) newState = STATES.endgame;
                    }
                    break;
                case STATES.reveal:
                    newState = STATES.firstcard;
                    break;
                case STATES.endgame:
                    //we can't leave the end game state
                    break;
                default:
            }
            //call our transition handler
            var changed = false;
            if (this._state != newState) {
                this._OnTransition(this._state, newState);
                changed = true;
            }
            this._state = newState;
            return changed;
        },

        _OnTransition: function (oldState, newState) {
            //console.log("Transition from " + oldState + " to " + newState);
            switch (oldState) {
                case STATES.lobby:
                    //set the timesJudged array
                    while (this._timesStoryTeller.length < this._players.length) this._timesStoryTeller.push(0);
                    //set the points array
                    while (this._points.length < this._players.length) this._points.push(0);
                    //sets up the votes
                    while (this._votes.length < this._players.length) this._votes.push(-1);
                    //set up hands
                    while (this._hands.length < this._players.length) this._hands.push([]);
                    //set up the hand limit
                    this._handLimit = Math.floor(NUM_CARDS / this._players.length);
                    if (this._handLimit > HAND_LIMT) this._handLimit = HAND_LIMT;
                    //set up mt random seed                    
                    var mt = Random.engines.mt19937();
                    var seed = hashCode(this._gameName)
                    mt.seed(seed); //TODO FIGURE OUT HOW TO 
                    this._mt = mt;
                    //console.log("Seeding with ", seed);
                    //set up the deck
                    for (var i = 0; i < NUM_CARDS; i++) this._deck.push(i);
                    break;
                case STATES.voting:
                case STATES.reveal:
                    //if we're the server and we are voting or when we are a player and we are leaving reveal
                    if ((this._server && this._state == STATES.voting) || (!this._server && this._state == STATES.reveal)) {
                        //tally up the scores
                        var pointsEarned = this.GetPointsEarned();
                        //distributes points to everyone

                        for (var i = 0; i < pointsEarned.length; i++) {
                            this._points.splice(i, 1, this._points[i] + pointsEarned[i]);
                        }

                        // increment the story teller piece of the puzzle
                        this._timesStoryTeller[this._storyteller]++;
                        this._storyteller = -1;

                        break;
                    }
            }
            switch (newState) {
                case STATES.firstcard:
                    //shuffle the deck
                    shuffleArray(this._deck, this._mt);

                    //resets the imagesSelected and adds them back to the deck
                    while (this._imagesSelected.length > 0) {
                        this._cardsPlayed.push(this._imagesSelected.pop());
                    }

                    //deal everyone a card until everyone has 5 cards
                    for (var i = 0; i < this._players.length; i++) {
                        while (this._hands[i].length < this._handLimit) {
                            if (this._deck.length == 0) { //if we are out of cards
                                if (this._cardsPlayed.length == 0) {
                                    console.error("WE DON'T HAVE ENOUGH CARDS FOR ALL THE PLAYERS");
                                    continue;
                                }
                                //transfer them from the cardsPlayed pile
                                while (this._cardsPlayed.length > 0) this._deck.push(this._cardsPlayed.pop());
                                shuffleArray(this._deck, this._mt);
                            }

                            var newCard = this._GetCardFromDeck();
                            this._hands[i].push(newCard);
                        }
                    }
                    //pick a new storyteller
                    var leastJudged = Math.min(...this._timesStoryTeller); //get the number that we are least storytellerd
                    var storytellerIndex = this._timesStoryTeller.indexOf(leastJudged);
                    //console.log("New storyteller is " + storytellerIndex)
                    this._storyteller = storytellerIndex;
                    //resets the votes
                    for (var i = 0; i < this._votes.length; i++) this._votes[i] = -1; //this would be better with a map but eh

                    while (this._imagesSelected.length < this._players.length) this._imagesSelected.push(-1);
                    break;
                case STATES.allcards:
                    break;
                case STATES.voting:
                    //fill in random cards until we have 6 cards
                    while (this._imagesSelected.filter(x => x != -1).length < 6) {
                        //add random cards to the end?
                        this._imagesSelected.push(this._GetCardFromDeck());
                    }
                    break;
            }
        },

        //Methods you can use to manipulate game state
        AddPlayer: function (playerName) {
            playerName = playerName.trim();
            if (playerName.length == 0) return "Invalid player name";
            if (playerName.length >= 20) return "Invalid player name";
            index = this._players.indexOf(playerName);

            if (index != -1) return "This player has already joined";
            if (this._state != STATES.voting && this._state != STATES.lobby) return "You cannot join the game";
            this._players.push(playerName);
            return 0;
        },
        FinishReveal: function () {
            if (!this._Transition()) return "We can't finish reveal";
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
            if (this._Transition())
                return 0;
            else
                return "Unable to start";
        },

        PickCard(playerIndex, cardId) {
            if (playerIndex < 0 || playerIndex >= this._players.length) return "Invalid player ID";
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

            var cardIndex = this._hands[playerIndex].indexOf(cardId);
            //if we don't actually hold this card
            if (cardIndex == -1) {
                this._imagesSelected[playerIndex] = -1;
                return "You can't play this card";
            }

            //remove the card from the player's hand
            this._hands[playerIndex].splice(cardIndex, 1);

            this._Transition();
            return 0;

        },
        VoteCard(playerIndex, voteCardId) {
            if (playerIndex < 0 || playerIndex >= this._players.length) return "Invalid player ID";
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

        EndGame: function () {
            this._state = STATES.endearly;
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

        SetLastCommandTime: function (time) {
            this._lastCommandTime = time;
        },
        ApplyFunc: function (name, args, time) {
            if (this.hasOwnProperty(name)) {
                console.log("Calling " + name + " with ", args);
                this.SetLastCommandTime(time);
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