const ScoreCards = require(appRoot + "/games/sushigo/common/cards").ScoreCards;
const GetDeck = require(appRoot + "/games/sushigo/common/cards").GetDeck;
const Card = require(appRoot + "/games/sushigo/common/cards").Card;

describe("sushigo deck", () => {
  it("should create a deck", () => {
    const deck = GetDeck();
    expect(deck.length).toEqual(108);
  });
});

describe("sushigo score sashimi", () => {
  it("score 1 player", () => {
    var playerHands = [[]];
    expect(ScoreCards(playerHands)).toEqual([0]);
    playerHands[0].push(new Card("Sashimi"));
    playerHands[0].push(new Card("Sashimi"));
    playerHands[0].push(new Card("Sashimi"));
    expect(ScoreCards(playerHands)).toEqual([10]);
    playerHands[0].push(new Card("Sashimi"));
    playerHands[0].push(new Card("Sashimi"));
    playerHands[0].push(new Card("Sashimi"));
    expect(ScoreCards(playerHands)).toEqual([20]);
  });
  it("score 2 player", () => {
    var playerHands = [[], []];
    expect(ScoreCards(playerHands)).toEqual([0, 0]);
    playerHands[0].push(new Card("Sashimi"));
    playerHands[0].push(new Card("Sashimi"));
    playerHands[0].push(new Card("Sashimi"));
    expect(ScoreCards(playerHands)).toEqual([10, 0]);
    playerHands[1].push(new Card("Sashimi"));
    playerHands[1].push(new Card("Sashimi"));
    playerHands[1].push(new Card("Sashimi"));
    expect(ScoreCards(playerHands)).toEqual([10, 10]);
  });
});

describe("sushigo score nigiri", () => {
  it("score 1 player", () => {
    var playerHands = [[]];
    expect(ScoreCards(playerHands)).toEqual([0]);
    playerHands[0].push(new Card("Nigiri", 2));
    expect(ScoreCards(playerHands)).toEqual([2]);
    playerHands[0].push(new Card("Nigiri", 3));
    expect(ScoreCards(playerHands)).toEqual([5]);
  });
  it("scores with wasabi ", () => {
    var playerHands = [[]];
    expect(ScoreCards(playerHands)).toEqual([0]);
    playerHands[0].push(new Card("Nigiri", 2));
    expect(ScoreCards(playerHands)).toEqual([2]);
    playerHands[0].push(new Card("Wasabi"));
    expect(ScoreCards(playerHands)).toEqual([2]);
    playerHands[0].push(new Card("Nigiri", 2));
    expect(ScoreCards(playerHands)).toEqual([8]);
  });
  it("scores with multiple wasabi ", () => {
    var playerHands = [[]];
    expect(ScoreCards(playerHands)).toEqual([0]);
    playerHands[0].push(new Card("Nigiri", 2));
    expect(ScoreCards(playerHands)).toEqual([2]);
    playerHands[0].push(new Card("Wasabi"));
    playerHands[0].push(new Card("Wasabi"));
    expect(ScoreCards(playerHands)).toEqual([2]);
    playerHands[0].push(new Card("Nigiri", 2));
    expect(ScoreCards(playerHands)).toEqual([8]);
    playerHands[0].push(new Card("Wasabi"));
    expect(ScoreCards(playerHands)).toEqual([8]);
  });
  it("score 2 player", () => {
    var playerHands = [[], []];
    expect(ScoreCards(playerHands)).toEqual([0, 0]);
    playerHands[0].push(new Card("Nigiri",2));
    playerHands[0].push(new Card("Nigiri",2));
    playerHands[0].push(new Card("Nigiri",2));
    expect(ScoreCards(playerHands)).toEqual([6, 0]);
    playerHands[1].push(new Card("Nigiri",1));
    playerHands[1].push(new Card("Nigiri",1));
    playerHands[1].push(new Card("Nigiri",1));
    expect(ScoreCards(playerHands)).toEqual([6, 3]);
  });
  it("score 2 player wasabi", () => {
    var playerHands = [[], []];
    expect(ScoreCards(playerHands)).toEqual([0, 0]);
    playerHands[0].push(new Card("Nigiri",2));
    playerHands[0].push(new Card("Nigiri",2));
    playerHands[0].push(new Card("Nigiri",2));
    expect(ScoreCards(playerHands)).toEqual([6, 0]);
    playerHands[1].push(new Card("Nigiri",1));
    playerHands[1].push(new Card("Nigiri",1));
    playerHands[1].push(new Card("Nigiri",1));
    expect(ScoreCards(playerHands)).toEqual([6, 3]);
  });
  
});

describe("sushigo score dumplings", () => {
  it("score dumplings 1 player", () => {
    var playerHands = [[]];
    expect(ScoreCards(playerHands)).toEqual([0]);
    playerHands[0].push(new Card("Dumpling", 3));
    expect(ScoreCards(playerHands)).toEqual([1]);
    playerHands[0].push(new Card("Dumpling", 3));
    expect(ScoreCards(playerHands)).toEqual([3]);
    playerHands[0].push(new Card("Dumpling", 3));
    expect(ScoreCards(playerHands)).toEqual([6]);
    playerHands[0].push(new Card("Dumpling", 3));
    expect(ScoreCards(playerHands)).toEqual([10]);
    playerHands[0].push(new Card("Dumpling", 3));
    expect(ScoreCards(playerHands)).toEqual([15]);
  });
  it("score dumplings 2 player", () => {
    var playerHands = [[], []];
    expect(ScoreCards(playerHands)).toEqual([0, 0]);
    playerHands[0].push(new Card("Dumpling", 3));
    playerHands[1].push(new Card("Dumpling", 3));
    expect(ScoreCards(playerHands)).toEqual([1, 1]);
    playerHands[0].push(new Card("Dumpling", 3));
    playerHands[1].push(new Card("Dumpling", 3));
    expect(ScoreCards(playerHands)).toEqual([3, 3]);
    playerHands[1].push(new Card("Dumpling", 3));
    expect(ScoreCards(playerHands)).toEqual([3, 6]);
  });
});

describe("sushigo score maki", () => {
  it("score highest 2 player", () => {
    var playerHands = [[], []];
    for (var i = 0; i < 2; i++) playerHands[0].push(new Card("Maki", 3));
    for (var i = 0; i < 1; i++) playerHands[1].push(new Card("Maki", 2));
    var scores = ScoreCards(playerHands);
    expect(scores).toEqual([6, 3]);
  });
  it("score highest ties 2 player", () => {
    var playerHands = [[], []];
    for (var i = 0; i < 2; i++) playerHands[0].push(new Card("Maki", 3));
    for (var i = 0; i < 2; i++) playerHands[1].push(new Card("Maki", 3));
    var scores = ScoreCards(playerHands);
    expect(scores).toEqual([3, 3]);
  });
  it("score highest and second 3 player", () => {
    var playerHands = [[], [], []];
    for (var i = 0; i < 1; i++) playerHands[0].push(new Card("Maki", 2));
    for (var i = 0; i < 2; i++) playerHands[1].push(new Card("Maki", 3));

    var scores = ScoreCards(playerHands);
    expect(scores).toEqual([3, 6, 0]);
  });
  it("score highest and tied second 3 player", () => {
    var playerHands = [[], [], []];
    for (var i = 0; i < 1; i++) playerHands[0].push(new Card("Maki", 2));
    for (var i = 0; i < 2; i++) playerHands[1].push(new Card("Maki", 3));
    for (var i = 0; i < 1; i++) playerHands[2].push(new Card("Maki", 2));

    var scores = ScoreCards(playerHands);
    expect(scores).toEqual([1, 6, 1]);
  });
  it("score tied highest and second 3 player", () => {
    var playerHands = [[], [], []];
    for (var i = 0; i < 2; i++) playerHands[0].push(new Card("Maki", 3));
    for (var i = 0; i < 2; i++) playerHands[1].push(new Card("Maki", 3));
    for (var i = 0; i < 1; i++) playerHands[2].push(new Card("Maki", 2));

    var scores = ScoreCards(playerHands);
    expect(scores).toEqual([3, 3, 0]);
  });
});
