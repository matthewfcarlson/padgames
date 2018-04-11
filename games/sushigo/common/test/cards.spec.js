const ScoreCards = require(appRoot + "/games/sushigo/common/cards").ScoreCards;
const GetDeck = require(appRoot + "/games/sushigo/common/cards").GetDeck;
const Card = require(appRoot + "/games/sushigo/common/cards").Card;

describe("sushigo deck", () => {
    it("should create a deck", () => {
        const deck = GetDeck();
        expect(deck.length).toEqual(108);
    });
});

describe("sushigo score dumplings", () => {
    it("score dumplings 1 player", () => {
        var playerHands = [[]];
        expect(ScoreCards(playerHands)).toEqual([0]);
        playerHands[0].push(new Card("Dumpling",3));
        expect(ScoreCards(playerHands)).toEqual([1]);
        playerHands[0].push(new Card("Dumpling",3));
        expect(ScoreCards(playerHands)).toEqual([3]);
        playerHands[0].push(new Card("Dumpling",3));
        expect(ScoreCards(playerHands)).toEqual([6]);
        playerHands[0].push(new Card("Dumpling",3));
        expect(ScoreCards(playerHands)).toEqual([10]);
        playerHands[0].push(new Card("Dumpling",3));
        expect(ScoreCards(playerHands)).toEqual([15]);
    });
});


describe("sushigo score maki", () => {
    it("score highest 2 player", () => {
        var playerHands = [[],[]];
        for (var i = 0; i < 2; i++) playerHands[0].push(new Card("Maki",3));
        for (var i = 0; i < 1; i++) playerHands[1].push(new Card("Maki",2));
        var scores = ScoreCards(playerHands);
        expect(scores).toEqual([6,3]);
    });
    it("score highest ties 2 player", () => {
        var playerHands = [[],[]];
        for (var i = 0; i < 2; i++) playerHands[0].push(new Card("Maki",3));
        for (var i = 0; i < 2; i++) playerHands[1].push(new Card("Maki",3));
        var scores = ScoreCards(playerHands);
        expect(scores).toEqual([3,3]);
    });
    it("score highest and second 3 player", () => {
        var playerHands = [[],[], []];
        for (var i = 0; i < 1; i++) playerHands[0].push(new Card("Maki",2));
        for (var i = 0; i < 2; i++) playerHands[1].push(new Card("Maki",3));
        
        var scores = ScoreCards(playerHands);
        expect(scores).toEqual([3,6,0]);
    });
    it("score highest and tied second 3 player", () => {
        var playerHands = [[],[], []];
        for (var i = 0; i < 1; i++) playerHands[0].push(new Card("Maki",2));
        for (var i = 0; i < 2; i++) playerHands[1].push(new Card("Maki",3));
        for (var i = 0; i < 1; i++) playerHands[2].push(new Card("Maki",2));
        
        var scores = ScoreCards(playerHands);
        expect(scores).toEqual([1,6,1]);
    });
    it("score tied highest and second 3 player", () => {
        var playerHands = [[],[], []];
        for (var i = 0; i < 2; i++) playerHands[0].push(new Card("Maki",3));
        for (var i = 0; i < 2; i++) playerHands[1].push(new Card("Maki",3));
        for (var i = 0; i < 1; i++) playerHands[2].push(new Card("Maki",2));
        
        var scores = ScoreCards(playerHands);
        expect(scores).toEqual([3,3,0]);
    });
});