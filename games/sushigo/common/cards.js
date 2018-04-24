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