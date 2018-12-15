webpackJsonp([1],{

/***/ "CHo/":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Random = __webpack_require__("LtXW");
var CardLib = __webpack_require__("vSBm");
var GetDeck = CardLib.GetDeck;
var ScoreCards = CardLib.ScoreCards;
var Card = CardLib.Card;

class Game {
  constructor(seed) {
    this.players = [];
    this.round = 0;
    this.playerHands = [];
    this.playersReady = [];
    this.playerRoundDeck = []; //the cards the player has put aside
    this.playerGameDeck = [];
    this.isPlaying = false;
    this.playerScores = [];
    this.lastRound = [];
    this.gameOver = false;
    if (seed == undefined) seed = 25;
    this.deckSeed = seed;
    this.turnNumber = 0;
  }

  SyncGame(game) {
    this.round = game.round;
    this.deckSeed = game.deckSeed;
    this.gameOver = game.gameOver;
    this.isPlaying = game.isPlaying;
    this.players = game.players;
    this.playerHands = game.playerHands;
    this.playerScores = game.playerScores;
    this.playersReady = game.playersReady;
    this.playerRoundDeck = game.playerRoundDeck;
    this.playerGameDeck = game.playerGameDeck;
    this.turnNumber = game.turnNumber;
  }

  StartRound() {
    this.playerRoundDeck = [];
    this.playersReady = [];
    for (var i = 0; i < this.players.length; i++) {
      this.playerRoundDeck.push([]);
      this.playersReady.push(false);
    }

    this.SetDeck();

    this.round++;
  }

  RoundScores() {
    return ScoreCards(this.playerRoundDeck);
  }

  EndRound() {
    console.log("Round " + this.round + " is over");

    //figure out scores

    for (var i = 0; i < this.players.length; i++) {
      //make sure we keep our cards like pudding
      //console.log(this.playerRoundDeck[i]);
      var keepCards = this.playerRoundDeck[i].filter(
        value => value.discarded == false
      );
      //console.log(keepCards);

      this.playerGameDeck[i] = this.playerGameDeck[i].concat(keepCards);
    }

    var scores = ScoreCards(this.playerRoundDeck);
    console.log(
      "This is the reason for the scores",
      CardLib.GetLastScoreReasons()
    );
    for (var i = 0; i < this.players.length && i <= scores.length; i++) {
      this.playerScores[i] += scores[i];
    }

    this.lastRound = this.playerRoundDeck;

    if (this.round == 3) {
      this.gameOver = true;
      this.isPlaying = false;
      return;
    }
    this.deckSeed += 7;
    this.StartRound();
  }

  //this can set the deck to be used for this round
  SetDeck() {
    //split the deck up by the number of players
    //in 2 player game 10 cards per player
    //3 player 9 cards
    //4 player = 8 cards
    //5 player = 7 cards
    //5+ = 7 cards
    var deck = GetDeck();
    //console.log(deck);

    var mt = Random.engines.mt19937();
    if (this.deckSeed == undefined) {
      mt = mt.autoSeed();
      console.log("Using autoseed");
    } else mt = mt.seed(this.deckSeed);
    Random.shuffle(mt, deck);
    //console.log("after shuffle", deck);
    //take the number of cards needed
    var numPlayers = this.players.length;
    var cardsPerPlayer = 12 - numPlayers;
    if (cardsPerPlayer > 10) cardsPerPlayer = 10;
    if (cardsPerPlayer < 7) cardsPerPlayer = 7;

    var numCards = numPlayers * cardsPerPlayer;

    deck = deck.slice(0, numCards);
    this.playerHands = [];
    //sort the deck out to the players
    for (var i = 0; i < numPlayers; i++) {
      this.playerHands.push(deck.splice(0, cardsPerPlayer));
    }

    //console.log("hopefully no cards left", deck);
  }

  AddPlayer(name) {
    if (this.isPlaying || this.gameOver) return false;
    if (this.players.indexOf(name) != -1) return false;
    this.players.push(name);
  }

  AddAI() {
    var name = "[AI]";
    var possibleNames = ["Billy", "Jean", "Bobby", "Stella", "Paul"];
    var mt = Random.engines.mt19937();
    if (this.deckSeed == undefined) {
      mt = mt.autoSeed();
      console.log("Using autoseed");
    } else mt = mt.seed(this.deckSeed);
    Random.shuffle(mt, possibleNames);

    name += possibleNames[this.players.length % possibleNames.length];
    if (!this.AddPlayer(name)) return false;
  }

  //what would happen if you gave these cards to these players
  CalculatePotentialScore(cards, playerIndex) {
    var allPlayerDecks = this.playerRoundDeck.slice(); //create a copy
    var newDeck = allPlayerDecks[playerIndex].slice();
    allPlayerDecks[playerIndex] = newDeck.concat(cards);
    return ScoreCards(allPlayerDecks);
  }

  /**
   * Calculates the moves for the AI - returns an array of moves
   */
  CalculateAIMoves(playerIndex) {
    //default behavior is to pick the first card they have
    var hand = this.playerHands[playerIndex].slice();
    var currentCards = this.playerRoundDeck[playerIndex].slice();
    var nextPlayer =
      playerIndex == 0 ? this.players.length - 1 : playerIndex - 1; //this is the player we are handing our cards to next
    var prevPlayer = (playerIndex + 1) % this.players.length; //this is the player we are getting cards from
    var nextPlayerCards = this.playerRoundDeck[nextPlayer].slice();
    var prevPlayerHand = this.playerHands[prevPlayer].slice(); //this could potentially be the same as next player

    var baseScores = ScoreCards(this.playerRoundDeck);
    //figure out a score for each card in your hand
    var scoredCards = hand.map((x, index) => {
      var help = 0;
      var hurt = 0;
      var value = 0;
      if (x.type == "chopsticks") {
        value = hand.length;
      } else {
        //we get the card that we care about
        var self = this;
        var maxScores = prevPlayerHand.map(newCard => {
          var newScores = self.CalculatePotentialScore(
            [x, newCard],
            playerIndex
          );
          //console.log(x.type+" and "+newCard.type+" = "+newScores[playerIndex]);
          return newScores[playerIndex];
        });
        //TODO figure out scarcity as well - this would help cards like wasabi to boost their score
        //console.log("Max scores for "+x.type+x.value,maxScores);
        var maxScore = maxScores.reduce(
          (prev, curr) => (prev < curr ? curr : prev),
          0
        );
        var scarcity = this.playerHands.reduce((acc, hand) => {
          return (
            acc +
            hand.reduce((acc, card) => {
              if (card.type == x.type) return acc + 1;
              return acc;
            }, 0)
          );
        }, 0);
        var totalCards = hand.length * this.playerHands.length;
        var newScores = this.CalculatePotentialScore([x], playerIndex);
        help = newScores[playerIndex] - baseScores[playerIndex];
        var potential = maxScore - help - baseScores[playerIndex];
        console.log(
          "For " +
            x.type +
            x.value +
            " we get " +
            help +
            " but could get " +
            potential
        );
        //TODO: figure out how to make it pick wasabi, pudding, and chopsticks more
        newScores = this.CalculatePotentialScore([x], nextPlayer);
        hurt = newScores[nextPlayer] - baseScores[nextPlayer];
        value = help + hurt * 0.5 + potential * 0.75;
      }
      return [index, value, x.type, help + "/" + hurt];
    });
    //console.log("Scored hand", scoredCards);
    var highestCards = scoredCards.sort((a, b) => {
      if (a[1] == b[1]) return 0;
      if (a[1] < b[1]) return 1;
      return -1;
    });
    console.log("sorted scored hand", highestCards);
    var pickedCards = [];
    if (this.HasChopsticks(playerIndex)) {
      //get the top two cards
      console.log("Using Chopsticks for AI" + playerIndex);
      pickedCards = highestCards.slice(0, 2);
    } else {
      //get the top card
      pickedCards = highestCards.slice(0, 1);
    }
    //remove the value
    return pickedCards.map(x => x[0]); //get the index part of it
  }

  //this starts the game
  StartGame() {
    if (this.players.length <= 1) return false;
    if (this.isPlaying || this.gameOver) return false;
    this.isPlaying = true;
    this.turnNumber = 1;
    //set all the scores to zero
    for (var i = 0; i < this.players.length; i++) {
      this.playerScores.push(0);
      this.playerRoundDeck.push([]);
      this.playerGameDeck.push([]);
    }

    this.StartRound();
  }

  //determines whether a player has chopsticks
  HasChopsticks(playerIndex) {
    var chopStickCards = this.playerRoundDeck[playerIndex].filter(
      x => x.type == "chopsticks"
    );
    //console.log("Chopstick cards",chopStickCards,this.playerRoundDeck[playerIndex]);
    return chopStickCards.length > 0;
  }

  //set aside the card of a player
  SetAsideCard(playerIndex, cardIndexs) {
    //called by the server?
    //check if they have a chopsticks in their roundDeck

    //console.log("Drawing card at" + cardIndexs + " for player " + playerIndex);
    if (
      cardIndexs == undefined ||
      this.isPlaying == false ||
      this.gameOver == true ||
      this.players.length <= playerIndex ||
      cardIndexs.length >= 3 ||
      (cardIndexs.length == 2 && !this.HasChopsticks(playerIndex))
    ) {
      //console.error("Invalid parameter");
      return false;
    }

    //check to make sure we can play
    if (this.playersReady[playerIndex] == true) {
      //if we don't have a chopsticks to use
      console.error("You have already grabbed a card player#" + playerIndex);
      return false;
    }
    //check to make sure they haven't already played

    //get the card I need
    if (cardIndexs.length > 2) {
      console.log("I can't handle multiple chopsticks");
      return false;
    } else if (cardIndexs.length == 2) {
      //handle the chopsticks case
      var pulledCards = this.playerHands[playerIndex].filter((x, index) => {
        return cardIndexs.indexOf(index) != -1;
      });
      this.playerHands[playerIndex] = this.playerHands[playerIndex].filter(
        (x, index) => {
          return cardIndexs.indexOf(index) == -1;
        }
      );
      //take out the chopstick
      var chopstickCards = this.playerRoundDeck[playerIndex]
        .map((x, index) => {
          x.index = index;
          return x;
        })
        .filter(x => x.type == "chopsticks")
        .map(x => x.index);
      //get the chopstick we used
      var usedChopstick = this.playerRoundDeck[playerIndex].splice(
        chopstickCards[0],
        1
      );
      var self = this;
      usedChopstick.forEach(element => {
        self.playerHands[playerIndex].push(element);
      });
      //add the cards we pulled earlier
      pulledCards.forEach(element => {
        self.playerRoundDeck[playerIndex].push(element);
      });
    } else {
      var cardIndex = cardIndexs[0];
      var card = this.playerHands[playerIndex][cardIndex];
      this.playerRoundDeck[playerIndex].push(card);
      this.playerHands[playerIndex].splice(cardIndex, 1);
      //console.log("Setting aside for player " + playerIndex, card);
    }

    this.playersReady[playerIndex] = true;

    if (this.HasEveryonePlayed()) {
      //console.log("Everyone has played!");
      this.EndTurn();
    }
    return true;
  }

  HasEveryonePlayed() {
    return this.playersReady.reduce(function(prev, current) {
      return current && prev;
    }, true);
  }

  GetHandCardCount() {
    //console.log(this.playerHands);
    return this.playerHands.map(value => value.length);
  }

  EndTurn() {
    //the server is the only one that calls this function
    //check to make sure all the cards have been set aside
    //all player's hands have been set aside
    //swap the hands until finished
    //set aside the hands
    this.playersReady = [];
    for (var i = 0; i < this.players.length; i++) {
      this.playersReady.push(false);
    }

    var hand = this.playerHands.splice(0, 1);
    this.playerHands.push(hand[0]);

    //todo check if there are cards left
    var handCounts = this.GetHandCardCount();

    var maxHandCount = handCounts.reduce(function(prev, curr) {
      return prev < curr ? curr : prev;
    }, 0);

    this.turnNumber++;

    if (maxHandCount <= 1) {
      for (var i = 0; i < this.playerHands.length; i++) {
        this.playerRoundDeck[i].push(this.playerHands[i].pop());
      }
      //console.log(this.playerRoundDeck);
      //console.log(this.playerHands);
      this.EndRound();
      //TODO: put the last cards into the player's deck round
    }
  }
}

module.exports = { Game };


/***/ }),

/***/ "WiZl":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });

// EXTERNAL MODULE: ./games/sushigo/common/game.js
var game = __webpack_require__("CHo/");
var game_default = /*#__PURE__*/__webpack_require__.n(game);

// EXTERNAL MODULE: ./node_modules/vue/dist/vue.esm.js
var vue_esm = __webpack_require__("7+uW");

// CONCATENATED MODULE: ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib/selector.js?type=script&index=0!./games/sushigo/client/card.vue
//
//
//
//
//
//
//
//
//
//
//
//


function GetCardColor(card) {
  switch (card.type) {
    case "sashimi":
      return "linear-gradient(to bottom, #bdd100 0%,#a3c441 100%)";
    case "nigiri":
      return "linear-gradient(to bottom, #fabf0b 0%,#fbcc0c 100%)";
    case "maki":
      return "linear-gradient(to bottom, #bd402c 0%,#d83f35 100%)";
    case "dumpling":
      return "linear-gradient(to bottom, #6e83bc 0%,#7693cd 100%)";
    case "chopsticks":
      return "linear-gradient(to bottom, #94cfc9 0%,#74c8ca 100%)";
    case "tempura":
      return "linear-gradient(to bottom, #b67fc2 0%,#9779c1 100%)";
    case "pudding":
      return "linear-gradient(to bottom, #f0c2c2 0%,#f2b7bd 100%)";
    case "wasabi":
      return "linear-gradient(to bottom, #fec900 0%,#ffbd1e 100%)";
    default:
      {
        console.error("Unknown card type", card.type);
        return "linear-gradient(to bottom, #fec900 0%,#ffbd1e 100%)";
      }
  }
}

/* harmony default export */ var card = ({
  props: ["card", "picked", "index"],
  name: "Sushies",
  methods: {
    PickedCard() {
      console.log("Picked card from card");
      this.$emit("click", this.index);
    },
    CardInfo() {
      console.log("Info wanted for card from card");
      this.$emit("card-info", this.index);
    }
  },
  data() {
    return {};
  },
  computed: {
    classes() {
      return {
        card: true,
        "sushi-card": true,
        picked: this.card.picked,
        picked2: this.picked
      };
    },
    headerStyle() {
      var style = {
        "background-color": "blue",
        "background": GetCardColor(this.card)
      };
      return style;
    },
    imgSrc() {
      if (this.card == undefined || this.card.type == undefined) return "N/A";
      switch (this.card.type) {
        case "nigiri":
          if (this.card.value == 1) return "/static/egg_nigiri.png";
          if (this.card.value == 2) return "/static/nigiri.png";
          if (this.card.value == 3) return "/static/squid_nigiri.png";
        case "pudding":
          return "/static/pudding.png";
        case "maki":
          return "/static/maki.png";
        case "tempura":
          return "/static/tempura.png";
        case "wasabi":
          return "/static/wasabi.png";
        case "chopsticks":
          return "/static/chopsticks.png";
        case "dumpling":
          return "/static/dumpling.png";
        case "sashimi":
          return "/static/sashimi.png"; //redo with face that's happier?
        default:
          {
            return "/static/default_sushi.png";
          }
      }
    },
    hint() {
      if (this.card == undefined || this.card.type == undefined) return "N/A";
      switch (this.card.type) {
        case "sashimi":
          return "x3=10";
        //case "nigiri": return this.card.value;
        case "maki":
          return ""; //most 6/3
        //case "dumpling": return ""; //1 3 5 10 15
        case "chopsticks":
          return ""; //end most=6, least= -6
        case "tempura":
          return "x2=5";
        //case "pudding": return "";//pick 2
        default:
          {
            return "";
          }
      }
    },
    longHint() {
      if (this.card == undefined || this.card.type == undefined) return "N/A";
      switch (this.card.type) {
        case "sashimi":
          return "Get 3 to get 10 points";
        case "nigiri":
          return "Worth the value listed on the card";
        case "maki":
          return "Whoever has the most at the end of the round gets 6 points, and the person with the second most gets 3 points"; //most 6/3
        case "dumpling":
          return "Depending on the number you get this round, you get 1, 3, 5, 10, or 15 points for 1 dumpling, 2 dumplings, and so on. There is no limit to the number of dumplings you can get"; //
        case "chopsticks":
          return "You take the chopsticks and next round you are allowed to take two cards at once, loudly declaring Sushi Go"; //end most=6, least= -6
        case "tempura":
          return "For every pair of Tempura, you get 5 points";
        case "wasabi":
          return "The next nigiri card you pick up after this wasabi card is worth 3x";
        case "pudding":
          return "Pudding points are counted at the end of the game. Whoever has the most gets 6 points, whoever has the least gets -6";
        default:
          return "";
      }
    }

  }
});
// CONCATENATED MODULE: ./node_modules/vue-loader/lib/template-compiler?{"id":"data-v-737ef0f0","hasScoped":true,"transformToRequire":{"video":["src","poster"],"source":"src","img":"src","image":"xlink:href"},"buble":{"transforms":{}}}!./node_modules/vue-loader/lib/selector.js?type=template&index=0!./games/sushigo/client/card.vue
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{class:_vm.classes},[_c('div',{staticClass:"card-header",style:(_vm.headerStyle),on:{"click":_vm.PickedCard}},[(_vm.card.value>0)?_c('span',{staticClass:"card-value"},[_vm._v(_vm._s(_vm.card.value))]):_vm._e(),_vm._v(" "),_c('img',{attrs:{"src":_vm.imgSrc}})]),_vm._v(" "),_c('div',{staticClass:"card-body",on:{"click":_vm.CardInfo}},[_vm._v("\n      "+_vm._s(_vm.card.name)+" "),_c('small',[_vm._v(_vm._s(_vm.hint))])])])}
var staticRenderFns = []
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ var client_card = (esExports);
// CONCATENATED MODULE: ./games/sushigo/client/card.vue
function injectStyle (ssrContext) {
  __webpack_require__("sxet")
}
var normalizeComponent = __webpack_require__("VU/8")
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-737ef0f0"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  card,
  client_card,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)

/* harmony default export */ var sushigo_client_card = (Component.exports);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib/selector.js?type=script&index=0!./games/sushigo/client/cardView.vue
//
//
//
//
//
//
//
//
//
//
//
//
//



/* harmony default export */ var cardView = ({
  components: {
    Card: sushigo_client_card
  },
  props: {
    cards: {
      required: true,
      type: Array
    },
    cardsSetAside: {
      default: [],
      type: Array,
      validator: function (value) {
        if (typeof value == "undefined") return false;
        if (typeof value != "array") return false;
        return false;
      }
    },
    title: {
      type: String,
      default: ""
    }
  },
  name: "Sushies",
  computed: {
    allCards() {
      var self = this;
      if (this.cards == undefined) return [];
      return this.cards.map((x, index) => {
        x.picked = false;
        if (typeof self.cardsSetAside !== "undefined" && self.cardsSetAside.indexOf(index) != -1) {
          x.picked = true;
        } // else console.log(typeof self.cardsSetAside, self.cardsSetAside);
        return x;
      });
    }
  },
  methods: {
    PickedCard(index) {
      this.$emit("picked-card", index);
      console.log("Picked card from card view");
    }
  },
  data() {
    return {};
  }
});
// CONCATENATED MODULE: ./node_modules/vue-loader/lib/template-compiler?{"id":"data-v-48a03a9e","hasScoped":true,"transformToRequire":{"video":["src","poster"],"source":"src","img":"src","image":"xlink:href"},"buble":{"transforms":{}}}!./node_modules/vue-loader/lib/selector.js?type=template&index=0!./games/sushigo/client/cardView.vue
var cardView_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_c('div',{staticClass:"card-view"},[_c('div',{staticClass:"card-viewer"},[_c('div',{staticClass:"card-view-title"},[_vm._v(_vm._s(_vm.title))]),_vm._v(" "),_vm._l((_vm.allCards),function(card,index){return [_c('card',{key:card.name+index,attrs:{"card":card,"index":index,"picked":card.picked},on:{"click":_vm.PickedCard}})]})],2)])])}
var cardView_staticRenderFns = []
var cardView_esExports = { render: cardView_render, staticRenderFns: cardView_staticRenderFns }
/* harmony default export */ var client_cardView = (cardView_esExports);
// CONCATENATED MODULE: ./games/sushigo/client/cardView.vue
function cardView_injectStyle (ssrContext) {
  __webpack_require__("bbKo")
}
var cardView_normalizeComponent = __webpack_require__("VU/8")
/* script */


/* template */

/* template functional */
var cardView___vue_template_functional__ = false
/* styles */
var cardView___vue_styles__ = cardView_injectStyle
/* scopeId */
var cardView___vue_scopeId__ = "data-v-48a03a9e"
/* moduleIdentifier (server only) */
var cardView___vue_module_identifier__ = null
var cardView_Component = cardView_normalizeComponent(
  cardView,
  client_cardView,
  cardView___vue_template_functional__,
  cardView___vue_styles__,
  cardView___vue_scopeId__,
  cardView___vue_module_identifier__
)

/* harmony default export */ var sushigo_client_cardView = (cardView_Component.exports);

// EXTERNAL MODULE: ./node_modules/vue-socket.io/dist/build.js
var build = __webpack_require__("hMcO");
var build_default = /*#__PURE__*/__webpack_require__.n(build);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib/selector.js?type=script&index=0!./games/sushigo/client/Sushi.vue
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//





vue_esm["a" /* default */].use(build_default.a, window.location.origin);
console.log("Connecting to " + window.location.origin);
/* harmony default export */ var Sushi = ({
  name: "Sushies",
  components: {
    CardView: sushigo_client_cardView
  },
  data() {
    return {
      isPhone: window.innerWidth <= 750,
      isLandscape: window.innerWidth >= 450,
      game: new game["Game"](),
      playerID: -1,
      cardsSetAside: false,
      connected: false,
      gameRoom: "",
      pickedCard: [],
      playerName: ""
    };
  },
  created: function () {
    var self = this;
    $(window).on("resize", function () {
      self.isPhone = window.innerWidth <= 750;
      self.isLandscape = window.innerWidth >= 450;
    });
    this.gameRoom = this.$route.params.gameID || "";
    if (!self.isPhone) {
      this.JoinGame(this.gameRoom, "");
    } else {
      //screen.orientation.lock('landscape');
    }
  },
  computed: {
    isLandscape: function () {
      return window.innerWidth > 450;
    },
    roundScores: function () {
      return this.game.RoundScores();
    }
  },
  methods: {
    ResetGame: function () {
      this.$socket.emit("reset sushi game", this.gameRoom);
    },
    StartGame: function () {
      this.$socket.emit("start sushi game");
    },
    PickCard: function (index) {
      if (this.cardsSetAside) {
        console.error("Client can't change their answer");
        return;
      }
      console.log("Client is picking card #" + index);
      var currentPickedIndex = this.pickedCard.indexOf(index);
      if (currentPickedIndex != -1) {
        this.pickedCard.splice(currentPickedIndex, 1);
      } else if (this.game.HasChopsticks(this.playerID)) {
        if (this.pickedCard.length > 1) this.pickedCard.splice(0, this.pickedCard.length);
        this.pickedCard.push(index);
      } else {
        if (this.pickedCard.length >= 1) this.pickedCard.splice(0, this.pickedCard.length);
        this.pickedCard.push(index);
      }
    },
    AddAI: function () {
      this.$socket.emit("add sushi ai");
    },
    ReadyToPick: function (index) {
      if (this.cardsSetAside) {
        console.error("Client can't resend their answer!");
        return;
      }
      if (this.pickedCard.length > 0) {
        this.$socket.emit("pick sushi card", this.pickedCard); //TODO: maybe send the round/turn number so the server doesn't double count
        this.cardsSetAside = true;
      }
    },
    JoinGame: function (gameRoom, playerName) {
      if (gameRoom == undefined) gameRoom = this.gameRoom;
      if (playerName == undefined) playerName = this.playerName;
      this.$socket.emit("join sushi game", gameRoom, playerName);
    },
    LeaveGame: function () {
      this.$router.push("/sushi");
    }
  },

  sockets: {
    connect: function () {
      console.log("socket connected");
      this.connected = true;
      if (!this.isPhone) this.$socket.emit("sync sushi game", this.gameRoom);
    },
    "sync sushi game": function (newGame) {
      console.log("We got a new state for the sushi game", newGame);
      if (newGame == null) {
        console.error("This is a bad game state");
        return;
      }
      this.game.SyncGame(newGame);
      this.$set(this.game, "playerHands", newGame.playerHands);
    },
    "set players": function (newPlayer) {
      this.$set(this.game, "players", newPlayer);
    },
    "start game": function () {
      this.game.StartGame();
    },
    "reset game": function () {
      this.game = new game["Game"](); //might need a vue.set here
      this.playerID = -1;
    },
    "set deck seed": function (seed) {
      this.game.deckSeed = seed;
    },
    "error message": function (message) {
      alert(message);
    },
    "set sushi player": function (id) {
      this.playerID = id;
      console.log("We are player #" + id);
    },
    "pick sushi card": function (playerID) {
      console.log("Player " + playerID + " is ready!");
      vue_esm["a" /* default */].set(this.game.playersReady, playerID, true);
    },
    "pick sushi cards": function (cardIDs) {
      console.log("All players have played!", cardIDs);
      this.cardsSetAside = false;
      this.pickedCard.splice(0, this.pickedCard.length);
      var self = this;
      //set everyone to not ready
      this.game.playersReady = self.game.playersReady.map(x => false);
      cardIDs.forEach((element, index) => {
        console.log("Setting aside cards for player " + index, element);
        self.game.SetAsideCard(index, element);
      });
      //this.game.SetAsideCard(playerID, cardID);
    }
  }
});
// CONCATENATED MODULE: ./node_modules/vue-loader/lib/template-compiler?{"id":"data-v-45efef4c","hasScoped":true,"transformToRequire":{"video":["src","poster"],"source":"src","img":"src","image":"xlink:href"},"buble":{"transforms":{}}}!./node_modules/vue-loader/lib/selector.js?type=template&index=0!./games/sushigo/client/Sushi.vue
var Sushi_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"game-content"},[(!_vm.isPhone)?_c('div',[_vm._l((_vm.game.players),function(player,playerIndex){return _c('div',{key:'player'+playerIndex,staticClass:"panel"},[_c('h3',[_vm._v(" "+_vm._s(player)+" "+_vm._s(_vm.game.playersReady[playerIndex])+" ")])])}),_vm._v(" "),_vm._l((_vm.game.players),function(playerName,playerID){return _c('card-view',{key:playerName,attrs:{"cards":_vm.game.playerRoundDeck[playerID],"title":playerName}})}),_vm._v("\n    Scores: "+_vm._s(_vm.game.playerScores)+"\n    "),_c('hr'),_vm._v(" "),_c('pre',{staticClass:"hidden-lg"},[_vm._v(_vm._s(_vm.game))]),_vm._v(" "),_c('button',{on:{"click":function($event){_vm.isPhone = true}}},[_vm._v("Play as a player")])],2):(!_vm.isLandscape)?_c('div',[_c('h2',[_vm._v("Please turn your phone sideways.\n  ")])]):(_vm.isPhone && _vm.playerID == -1 && !_vm.game.isPlaying)?_c('div',{staticClass:"container-fluid"},[_c('h2',[_vm._v("Sushi GO!")]),_vm._v(" "),_c('hr'),_vm._v(" "),_c('h3',[_vm._v("Please Input Your Name")]),_vm._v(" "),_c('input',{directives:[{name:"model",rawName:"v-model",value:(_vm.playerName),expression:"playerName"}],staticClass:"form-control",attrs:{"type":"text","placeholder":"Your name"},domProps:{"value":(_vm.playerName)},on:{"input":function($event){if($event.target.composing){ return; }_vm.playerName=$event.target.value}}}),_vm._v(" "),_c('button',{staticClass:"btn btn-success btn-block",on:{"click":function($event){_vm.JoinGame()}}},[_vm._v("Join Game")]),_vm._v(" "),_c('br'),_vm._v(" "),_c('button',{staticClass:"btn btn-danger",on:{"click":_vm.LeaveGame}},[_vm._v("Leave Game")])]):(_vm.isPhone && _vm.playerID == -1 && _vm.game.isPlaying)?_c('div',{staticClass:"container-fluid"},[_c('h2',[_vm._v("Sushi GO!")]),_vm._v(" "),_c('hr'),_vm._v(" "),_c('h3',[_vm._v("This game is in progress. I'm working on being able to rejoin games but I'm not there yet")]),_vm._v(" "),_c('br'),_vm._v(" "),_c('button',{staticClass:"btn btn-danger",on:{"click":_vm.LeaveGame}},[_vm._v("Leave Game")])]):(_vm.isPhone && _vm.playerID != -1)?_c('div',{staticClass:"container-fluid"},[_c('div',[_vm._v("Player "+_vm._s(_vm.playerID)+" Round "+_vm._s(_vm.game.round))]),_vm._v(" "),(_vm.game.isPlaying == true)?_c('div',[_c('div',{staticClass:"row"},_vm._l((_vm.game.players),function(player,index){return _c('div',{key:'player'+index,staticClass:"col-sm"},[(index == _vm.playerID)?_c('i',{staticClass:"fas fa-user"}):_vm._e(),_vm._v(" "+_vm._s(player)+" \n            "),(_vm.game.playersReady.length >= index)?_c('span',[_vm._v(_vm._s(_vm.game.playersReady[index]))]):_vm._e(),_vm._v(" "),(_vm.game.playerScores.length >= index)?_c('span',[_vm._v(_vm._s(_vm.game.playerScores[index]))]):_vm._e(),_vm._v(" "),(_vm.game.playerScores.length >= index)?_c('span',[_vm._v(_vm._s(_vm.roundScores[index]))]):_vm._e()])})),_vm._v(" "),_c('card-view',{staticClass:"row",attrs:{"cards":_vm.game.playerHands[_vm.playerID],"cards-set-aside":_vm.pickedCard,"id":"player-hand","title":"Hand"},on:{"picked-card":_vm.PickCard}}),_vm._v(" "),_c('div',{staticClass:"row"},[_c('div',{staticClass:"col-1"},[_c('button',{staticClass:"btn btn-success",attrs:{"disabled":_vm.cardsSetAside.length > 0},on:{"click":_vm.ReadyToPick}},[_vm._v("Play")])]),_vm._v(" "),_c('card-view',{staticClass:"col",attrs:{"cards":_vm.game.playerRoundDeck[_vm.playerID],"id":"player-deck","title":"Deck"}})],1)],1):(_vm.game.gameOver)?_c('div',[_c('h2',[_vm._v("Game over!")]),_vm._v(" "),_c('ul',_vm._l((_vm.game.players),function(player,index){return _c('li',[_vm._v(" "+_vm._s(player)+" "+_vm._s(_vm.game.scores[index])+" ")])}))]):_c('div',[_c('p',[_vm._v("Waiting for the game to start")]),_vm._v(" "),_c('p',[_vm._v("Players waiting:")]),_vm._v(" "),_c('ul',_vm._l((_vm.game.players),function(player){return _c('li',[_vm._v(" "+_vm._s(player)+" ")])}))]),_vm._v(" "),(!_vm.game.isPlaying && _vm.playerID == 0)?_c('button',{staticClass:"btn",on:{"click":_vm.StartGame}},[_vm._v("StartGame")]):_vm._e(),_vm._v(" "),(!_vm.game.isPlaying && _vm.playerID == 0)?_c('button',{staticClass:"btn",on:{"click":_vm.AddAI}},[_vm._v("Add AI")]):_vm._e(),_vm._v(" "),_c('br'),_vm._v(" "),_c('hr'),_vm._v(" "),_c('button',{staticClass:"btn btn-danger",on:{"click":_vm.LeaveGame}},[_vm._v("Leave Game")])]):_c('div',[_vm._v("\n    Unknown state\n  ")])])}
var Sushi_staticRenderFns = []
var Sushi_esExports = { render: Sushi_render, staticRenderFns: Sushi_staticRenderFns }
/* harmony default export */ var client_Sushi = (Sushi_esExports);
// CONCATENATED MODULE: ./games/sushigo/client/Sushi.vue
function Sushi_injectStyle (ssrContext) {
  __webpack_require__("sgIX")
}
var Sushi_normalizeComponent = __webpack_require__("VU/8")
/* script */


/* template */

/* template functional */
var Sushi___vue_template_functional__ = false
/* styles */
var Sushi___vue_styles__ = Sushi_injectStyle
/* scopeId */
var Sushi___vue_scopeId__ = "data-v-45efef4c"
/* moduleIdentifier (server only) */
var Sushi___vue_module_identifier__ = null
var Sushi_Component = Sushi_normalizeComponent(
  Sushi,
  client_Sushi,
  Sushi___vue_template_functional__,
  Sushi___vue_styles__,
  Sushi___vue_scopeId__,
  Sushi___vue_module_identifier__
)

/* harmony default export */ var sushigo_client_Sushi = __webpack_exports__["default"] = (Sushi_Component.exports);


/***/ }),

/***/ "bbKo":
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ "sgIX":
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ "sxet":
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ "vSBm":
/***/ (function(module, exports) {

function EmptyScore(size) {
  var scores = [];
  for (var i = 0; i < size; i++) scores.push(0);
  return scores;
}

function FilterHands(hands, card) {
  return hands.map(function(hand) {
    return hand.filter(function(c) {
      if (c == null) console.error("This is a bad card",c,hands);
      return c.type == card;
    });
  });
}

function ScoreNigiri(hands) {
  var scores = hands.map(function(hand) {
    hand = hand.filter(x => x.type == "nigiri" || x.type == "wasabi");
    //figure out what the points are worth
    var multiplier = false;
    var score = 0;
    for (var i = 0; i < hand.length; i++) {
      if (hand[i].type == "wasabi") multiplier = true;
      else {
        if (multiplier) {
          score += hand[i].value * 3;
        } else {
          score += hand[i].value;
        }
        multiplier = false;
      }
    }
    return score;
    
    
  });
  //console.log("Nigiri",scores);
  return scores;
}

function ScoreSashimi(hands) {
  var sashimiCards = FilterHands(hands, "sashimi");
  var countPerPlayer = sashimiCards.map(hand => hand.length);
  var scores = countPerPlayer.map(function(value) {
    return Math.floor(value/3) * 10;
  });
  //console.log("Sashimi:", scores);
  return scores;
}

function ScoreDumplings(hands) {
  var dumplingCards = FilterHands(hands, "dumpling");

  var countPerPlayer = dumplingCards.map(hand => hand.length);

  var pointValues = [0, 1, 3, 6, 10, 15, 16, 18, 21, 25, 30];

  var scores = countPerPlayer.map(function(value) {
    return pointValues[value];
  });

  //console.log("Dumplings", scores);

  return scores;
}

function ScoreMaki(hands) {
  //figure out which player has the most maki cards
  var makiCards = FilterHands(hands,"maki");    
  var makiValues = makiCards.map(function(hand) {
    return hand.reduce(function(prev, curr) {
      return prev + curr.value;
    }, 0);
  });
  //TODO remove all the maki cards
  var maxMaki = 0;
  var secondHighest = 0;
  var maxCount = 0;
  var secondCount = 0;

  for (var i = 0; i < makiValues.length; i++) {
    if (makiValues[i] > maxMaki) {
      maxMaki = makiValues[i];
      maxCount = 1;
    } else if (makiValues[i] == maxMaki) {
      maxCount++;
    }
  }
  //get the second highest maki hand
  for (var i = 0; i < makiValues.length; i++) {
    if (makiValues[i] >= maxMaki) {
      continue;
    } else if (makiValues[i] > secondHighest) {
      secondHighest = makiValues[i];
      secondCount = 1;
    } else if (makiValues[i] == secondHighest) {
      secondCount++;
    }
  }

  /*console.log(
    "Scores " +
      makiValues.join(",") +
      "\tMax:" +
      maxMaki +
      " second:" +
      secondHighest +
      "\tMax count:" +
      maxCount +
      " second count:" +
      secondCount
  );*/

  if (maxCount > 1) secondCount = 0;

  var highestPointsAwarded = Math.floor(6 / maxCount);
  var secondHighPointsAwarded =
    secondCount != 0 ? Math.floor(3 / secondCount) : 0;

  if (maxMaki == 0) highestPointsAwarded = 0;
  if (secondHighest == 0) secondHighPointsAwarded = 0;

  var scores = makiValues.map(function(value) {
    if (value == maxMaki) return highestPointsAwarded;
    if (value == secondHighest) return secondHighPointsAwarded;
    return 0;
  });

  return scores;
}

function ScoreTempura(hands) {
  var tempuraCards = FilterHands(hands, "tempura");
  var scores = tempuraCards.map((x)=> Math.floor(x.length/2) * 5);
  //console.log("ALL TEMPURA", tempuraCards);
  return scores;
}

var lastScoreReasons = {};

function GetLastScoreReasons(){
  //TODO massage the data a little
  var data = [];
  for (scoreCategory in lastScoreReasons){
    lastScoreReasons[scoreCategory].forEach((score,index)=>{
      if (data[index] == undefined) data[index] = {};
      if (score == 0) return;
      data[index][scoreCategory] = score;
    });
  }
  return data;
}
function ScoreCards(hands) {
  if (hands == undefined) return "ERROR";
  //figure out the list of cards
  var scorers = [ScoreMaki, ScoreTempura, ScoreSashimi, ScoreDumplings,ScoreNigiri];
  var scores = EmptyScore(hands.length);
  lastScoreReasons = {};
  scorers.forEach(calculator => {    
    var result = calculator(hands);
    scores = AddScores(scores, result);
    lastScoreReasons[calculator.name] = result;
  });
  return scores;
}

function AddScores(score, newScore) {
  //console.log(newScore);
  for (var i = 0; i < score.length && i <= newScore.length; i++) {
    score[i] += newScore[i];
  }
  return score;
}
//get the whole deck
function GetDeck() {
  //14 tempura
  //14x sashimi
  //14x dumplings
  //12x 2 maki
  //8x 3 maki rolls
  //6x 1 maki roll
  //10x salmon nigiri
  //5x squid nigir
  //5x egg nigiri
  //10x pudding
  //6x wasabi
  //4x chopsticks
  var deck = [];
  for (var i = 0; i < 14; i++) deck.push(new Card("Tempura"));

  for (i = 0; i < 14; i++) deck.push(new Card("Sashimi"));

  for (i = 0; i < 14; i++) deck.push(new Card("Dumpling"));

  for (i = 0; i < 12; i++) deck.push(new Card("Maki", 2));
  for (i = 0; i < 8; i++) deck.push(new Card("Maki", 3));
  for (i = 0; i < 6; i++) deck.push(new Card("Maki", 1));

  for (i = 0; i < 10; i++) deck.push(new Card("Salmon Nigiri", 2, "nigiri"));
  for (i = 0; i < 5; i++) deck.push(new Card("Squid Nigiri", 3, "nigiri"));
  for (i = 0; i < 5; i++) deck.push(new Card("Egg Nigiri", 1, "nigiri"));

  for (i = 0; i < 10; i++) deck.push(new Card("Pudding", false));

  for (i = 0; i < 6; i++) deck.push(new Card("Wasabi"));

  for (i = 0; i < 4; i++) deck.push(new Card("Chopsticks"));

  //Tempaki = most gets 4 pts, least gets -4 if multiple, it splits
  //Uramaki = first player to get 10 gets 8 points, next gets 5, next gets 2
  //Edamame = 1 pt per player who has one
  //Eel - 1 eel = -3, 2+ eel = 7
  //Onigiri - unique shapes
  //Miso - if more than one miso is played in one turn, it will discarded
  //Tofu - 1 = 2, 2 = 6, 3+ = 0
  //Green tea ice cream -dessert
  //fruit - dessert

  return deck;
}

//at the end a game, 
function ScoreGame(hands){
  return EmptyScore(hands);
}

class Card {
  constructor(name, value, type) {
    this.name = name;
    if (type == undefined) type = name;
    this.type = type.toLowerCase();
    if (value == undefined) value = 0;
    this.value = value; //this can be an array - means you need multiple of this card to do this

    //if the value is false we don't discard it at the end of the game
    if (value === false)
      this.discarded = false; //if it's only calculated at the end  of the game
    else this.discarded = true;
  }
  //TODO define modular arch for defining how the different cards interact and how to calculate points
}

module.exports = { ScoreCards, GetDeck, Card, ScoreGame, GetLastScoreReasons };

/***/ })

});
//# sourceMappingURL=1.043dd2161fc9605e2902.js.map