"use strict";
class Card {
  constructor(name, value, type) {
    this.name = name;
    if (type == undefined) type = name.toLowerCase();
    this.type = type;
    if (value == undefined) value = 0;
    this.value = value; //this can be an array - means you need multiple of this card to do this

    //if the value is false we don't discard it at the end of the game
    if (value === false)
      this.discarded = false; //if it's only calculated at the end  of the game
    else this.discarded = true;
  }
  //TODO define modular arch for defining how the different cards interact and how to calculate points
}

import Random from "random-js";

export default class Game {
  constructor(seed) {
    this.players = [];
    this.round = 0;
    this.playerHands = [];
    this.playersReady = [];
    this.playerRoundDeck = []; //the cards the player has put aside
    this.playerGameDeck = [];
    this.isPlaying = false;
    this.playerScores = [];
    this.gameOver = false;
    if (seed == undefined) seed = 50;
    this.deckSeed = seed;
  }

  //get the whole deck
  GetDeck() {
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

    for (i = 0; i < 14; i++) deck.push(new Card("Sashimi"));

    for (i = 0; i < 12; i++) deck.push(new Card("Maki", 2));
    for (i = 0; i < 8; i++) deck.push(new Card("Maki", 3));
    for (i = 0; i < 6; i++) deck.push(new Card("Maki", 1));

    for (i = 0; i < 10; i++) deck.push(new Card("Salmon Nigiri", 3, "nigiri"));
    for (i = 0; i < 5; i++) deck.push(new Card("Squid Nigiri", 2, "nigiri"));
    for (i = 0; i < 5; i++) deck.push(new Card("Egg Nigiri", 1, "nigiri"));

    for (i = 0; i < 10; i++) deck.push(new Card("Pudding", false));

    for (i = 0; i < 6; i++) deck.push(new Card("Wasabi"));

    for (i = 0; i < 4; i++) deck.push(new Card("Chopsticks"));

    return deck;
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

  CalculateHandScore(playerIndex) {
    var hand = this.playerRoundDeck[playerIndex];

    return 5;
  }

  EndRound() {
    console.log("Round " + this.round + " is over");
    if (this.round == 3) {
      this.gameOver = true;
      this.isPlaying = false;
      return;
    }

    //figure out scores

    for (var i = 0; i < this.players.length; i++) {
      var score = this.CalculateHandScore(i);
      console.log("Player " + i + " got points" + score);
      this.playerScores[i] += score;
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
    var deck = this.GetDeck();
    console.log(deck);

    var mt = Random.engines.mt19937();
    if (this.deckSeed == undefined) {
      mt = mt.autoSeed();
      console.log("Using autoseed");
    } else mt = mt.seed(this.deckSeed);
    Random.shuffle(mt, deck);
    console.log("after shuffle", deck);
    //take the number of cards needed
    var numPlayers = this.players.length;
    var cardsPerPlayer = 12 - numPlayers;
    if (cardsPerPlayer > 10) cardsPerPlayer = 10;
    if (cardsPerPlayer < 7) cardsPerPlayer = 7;

    var numCards = numPlayers * cardsPerPlayer;

    deck = deck.slice(0, numCards);

    //sort the deck out to the players
    for (var i = 0; i < numPlayers; i++) {
      this.playerHands.push(deck.splice(0, cardsPerPlayer));
    }

    console.log("hopefully no cards left", deck);
  }

  AddPlayer(name) {
    if (this.isPlaying) return false;
    this.players.push(name);
  }

  //this starts the game
  StartGame() {
    if (this.players.length <= 1) return false;
    if (this.isPlaying || this.gameOver) return false;
    this.isPlaying = true;
    //set all the scores to zero
    for (var i = 0; i < this.players.length; i++) {
      this.playerScores.push(0);
      this.playerRoundDeck.push([]);
    }
    
    this.StartRound();
  }

  //set aside the card of a player
  SetAsideCard(playerIndex, cardIndex) {
    //called by the server?
    //check if they have a chopsticks in their roundDeck

    console.log("Drawing card at" + cardIndex + " for player " + playerIndex);
    if (
      this.isPlaying == false ||
      this.gameOver == true ||
      this.players.length <= playerIndex ||
      cardIndex >= this.playerHands[playerIndex].length
    ) {
      console.error("Invalid parameter");
      return false;
    }

    //check to make sure we can play
    if (this.playersReady[playerIndex]) {
      //if we don't have a chopsticks to use
      console.error("You have already grabbed a card");
      return false;
    }

    this.playersReady[playerIndex] = true;

    //get the card I need
    var card = this.playerHands[playerIndex][cardIndex];
    this.playerRoundDeck[playerIndex].push(card);
    this.playerHands[playerIndex].splice(cardIndex, 1);
    console.log("Setting aside for player " + playerIndex, card);

    if (this.HasEveryonePlayed()) {
      console.log("Everyone has played!");
      this.EndTurn();
    }
  }

  HasEveryonePlayed() {
    return this.playersReady.reduce(function(prev, current) {
      return current && prev;
    }, true);
  }

  GetHandCardCount() {
      console.log(this.playerHands);
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
    console.log("Hand Counts", handCounts);

    var maxHandCount = handCounts.reduce(function(prev, curr) {
      return prev < curr ? curr : prev;
    }, 0);
    console.log("MAX: "+maxHandCount);
    if (maxHandCount <= 1) {
      this.EndRound();
      //TODO: put the last cards into the player's deck round
    }
  }
}
