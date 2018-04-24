"use strict";

var Random = require("random-js");
var CardLib = require("./cards");
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
