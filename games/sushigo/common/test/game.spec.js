const Game = require(appRoot + "/games/sushigo/common/game").Game;


describe("sushigo game", () => {
  it("should create an empty default game", () => {
    const game = new Game();
    expect(game.round).toEqual(0);
    expect(game.players.length).toEqual(0);
    expect(game.playerScores.length).toEqual(0);
  });
  it("should let a player join", () => {
    const game = new Game();
    expect(game.round).toEqual(0);
    game.AddPlayer("Paul");
    expect(game.players.length).toEqual(1);
  });
  it("should start a game", () => {
    const game = new Game();
    game.AddPlayer("Paul");
    game.AddPlayer("Todd");
    game.StartGame();
    expect(game.round).toEqual(1);
    expect(game.playerScores.length).toBe(2);
    expect(game.playerHands.length).toBe(2);
    //if all players got the same number of cards
    expect(game.playerHands[0].length).toEqual(game.playerHands[1].length);
  });
  it("shouldn't let a player join after a game has started", () => {
    const game = new Game();
    game.AddPlayer("Paul");
    game.AddPlayer("Todd");
    game.StartGame();
    game.AddPlayer("Jim");
    expect(game.players.length).toEqual(2);
  });
  it("should not let the same player join twice", () => {
    var game = new Game();
    game.AddPlayer("Paul");
    expect(game.players.length).toEqual(1);
    game.AddPlayer("Paul");
    expect(game.players.length).toEqual(1);    
  });

  it("should not let me pick two card without chopsticks", () => {
    var game = new Game();
    game.AddPlayer("Paul");
    game.AddPlayer("Todd");
    game.StartGame();
    game.deckSeed = 50;
    //play for each of the people
    if (game.playerHands[0][0].type != "chopsticks") {
      game.SetAsideCard(0,[0]);
    }
    if (game.playerHands[1][0].type != "chopsticks") {
      game.SetAsideCard(1,[0]);
    }

    var result = game.SetAsideCard(0,[0,1]);
    expect(result).toBe(false);
    expect(game.playersReady[0]).toBe(false);
    
  });

  it("should let me pick two card with chopsticks", () => {
    var game = new Game();
    game.AddPlayer("Paul");
    game.AddPlayer("Todd");
    game.StartGame();
    game.deckSeed = 50;
    game.playerHands[0]
    //play for each of the people
    game.playerHands[0][0].type="chopsticks";
    game.playerHands[0][0].name="Test Chopsticks";
    game.SetAsideCard(0,[0]);
    game.SetAsideCard(1,[0]);
    
    var cards = [game.playerHands[0][0], game.playerHands[0][1]];
    //grab two cards at the same time
    var result = game.SetAsideCard(0,[0,1]);    
    var chopsticks = game.playerHands[0][game.playerHands[0].length-1];
    expect(chopsticks.type).toBe("chopsticks");
    expect(chopsticks.name).toBe("Test Chopsticks");
    
    expect(result).toBe(true);
    expect(game.playersReady[0]).toBe(true);
    expect(game.playerRoundDeck[0]).toEqual(cards);
    
  });

  //TODO write a test case for chopsticks

  it("it should deal the same hand every time", () => {
    var game = new Game();
    var game2 = new Game();
    game.AddPlayer("Paul");
    game2.AddPlayer("Paul");    
    game.AddPlayer("Neal");
    game2.AddPlayer("Neal");
    expect(game.players.length).toEqual(2);
    expect(game2.players.length).toEqual(2);

    game.deckSeed = 50;
    game2.deckSeed = 50;
    game.StartGame();
    game2.StartGame();

    game.playerHands.forEach((element,index) => {
        expect(element).toEqual(game2.playerHands[index]);
    });
  });
  it("it should not deal the same hand with different seeds", () => {
    var game = new Game();
    var game2 = new Game();
    game.AddPlayer("Paul");
    game2.AddPlayer("Paul");    
    game.AddPlayer("Neal");
    game2.AddPlayer("Neal");
    expect(game.players.length).toEqual(2);
    expect(game2.players.length).toEqual(2);

    game.deckSeed = 50;
    game2.deckSeed = 55;
    game.StartGame();
    game2.StartGame();

    game.playerHands.forEach((element,index) => {
        expect(element).not.toEqual(game2.playerHands[index]); //it's possible a hand could be the same
    });
  });
  it("should play a 2 player round", () => {
    const game = new Game();
    game.AddPlayer("Paul");
    game.AddPlayer("Todd");
    game.StartGame();
    expect(game.round).toEqual(1);
    expect(game.playerScores.length).toBe(2);
    expect(game.playerHands.length).toBe(2);
    //if all players got the same number of cards
    expect(game.playerHands[0].length).toEqual(game.playerHands[1].length);
    //TODO finish
  });
});
