function EmptyScore(hands) {
  var scores = [];
  for (var i = 0; i < hands.length; i++) scores.push(0);
  return scores;
}

function FilterHands(hands, card) {
  return hands.map(function(hand) {
    return hand.filter(function(c) {
      return c.type == card;
    });
  });
}

function ScoreSashimi(hands) {
    var scores = hands.map(function(hand){
        hand = hand.filter(x=>x.type == "sashimi"||x.type=="wasabi");
        //figure out what the points are worth
        var multiplier = false;
        var score = 0;
        for (var i=0;i<hand.length;i++){
            if (hand[i].type == "wasabi") multiplier = true;
            else {
                if (multiplier){
                    score += hand[i].value * 3;
                } else {
                    score += hand[i].value;
                }
                multiplier = false;
            }
        }
        return score;
    });

    console.log("Sashimi:",scores);
    return EmptyScore(hands);

}

function ScoreDumplings(hands) {
  var dumplingCards = FilterHands(hands, "dumpling");

  var countPerPlayer = dumplingCards.map(hand => hand.length);

  var pointValues = [1, 3, 6, 10, 15];

  var scores = countPerPlayer.map(function(value){
    if (value >= pointValues.count) return 15;
    return pointValues[value];
  });

  console.log("Dumplings",scores);

  return scores;

  
}

function ScoreMaki(hands) {
  //figure out which player has the most maki cards
  var makiCards = hands.map(function(hand) {
    return hand.filter(function(c) {
      return c.type == "maki";
    });
  });
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
    } else if (makiValues[i] > secondHighest) {
      secondCount = makiValues[i];
      secondCount = 1;
    } else if (makiValues[i] == secondHighest) {
      secondCount++;
    }
  }

  if (maxCount > 1) secondCount = 0;

  var highestPointsAwarded = Math.floor(6 / maxCount);
  var secondHighPointsAwarded =
    secondCount != 0 ? Math.floor(3 / secondCount) : 0;

  var scores = makiValues.map(function(value) {
    if (value == maxMaki) return highestPointsAwarded;
    if (value == secondHighest) return secondHighPointsAwarded;
    return 0;
  });

  return scores;
}

function ScoreTempura(hands) {
  var scores = EmptyScore(hands);
  var tempuraCards = hands.map(function(hand) {
    return hand.filter(function(c) {
      //console.log(c.type, c.type == "tempura");
      return c.type == "tempura";
    }).length;
  });
  //console.log("ALL TEMPURA", tempuraCards);
  return scores;
}
function ScoreCards(hands) {
  //figure out the list of cards
  var scores = EmptyScore(hands);
  scores = AddScores(scores, ScoreMaki(hands));
  scores = AddScores(scores, ScoreTempura(hands));
  scores = AddScores(scores, ScoreSashimi(hands));
  scores = AddScores(scores, ScoreDumplings(hands));
  return scores;
}

function AddScores(score, newScore) {
  for (var i = 0; i < score.length && i <= newScore.length; i++) {
    score[i] += newScore[i];
  }
  return score;
}

module.exports = {ScoreCards};
