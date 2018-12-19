const CreateGame = require(appRoot + "/games/dixit/common/dixit").CreateGame;

describe("create game", () => {
  it("should create an object", () => {
    const game = CreateGame();
    expect(game).not.toBeNull()
    expect(game).not.toBeUndefined()
  });
  it("should allow me to create players", () => {
    const game = CreateGame();
    game.AddPlayer("Matthew1");
    game.AddPlayer("Matthew2");
    game.AddPlayer("Matthew3");
    expect(game.GetPlayers()).toHaveLength(3);
  });
  it("should not allow duplicate name players", () => {
    const game = CreateGame();
    game.AddPlayer("Matthew1");
    game.AddPlayer("Matthew2");
    game.AddPlayer("Matthew1");
    game.AddPlayer("Matthew1 ");
    expect(game.GetPlayers()).toHaveLength(2);
  });
  it("should not allow players after the game is created", () => {
    const game = CreateGame();
    game.AddPlayer("Matthew1");
    game.AddPlayer("Matthew2")
    game.AddPlayer("Matthew3");
    game.StartGame();
    result = game.AddPlayer("Matthew4")
    expect(result).not.toEqual(0);
    expect(game.GetPlayers()).toHaveLength(3);
  });
  it("should start the game", () => {
    const game = CreateGame();
    game.AddPlayer("Matthew1");
    game.AddPlayer("Matthew2")
    game.AddPlayer("Matthew3");
    var state = game.GetState();
    game.StartGame();
    expect(game.GetState()).not.toEqual(state)
  });


  it("should not let me start a game twice", () => {
    const game = CreateGame();
    game.AddPlayer("Matthew1");
    game.AddPlayer("Matthew2")
    game.AddPlayer("Matthew3");

    var ret = game.StartGame();
    var ret2 = game.StartGame();

    expect(ret).toBe(0);
    expect(ret2).not.toBe(ret); //some none zero error code

  });
  it("each player should have 5 cards in their deck", () => {
    const game = CreateGame();
    game.AddPlayer("Matthew1");
    game.AddPlayer("Matthew2")
    game.AddPlayer("Matthew3");

    var ret = game.StartGame();
    expect(ret).toBe(0);
    var players = game.GetPlayers();
    for (var i = 0; i < players.length; i++) {
      var hand = game.GetPlayerHand(i);
      expect(hand.length).toBe(5);
    }
  });

  it("each player should have unique cards in their deck", () => {
    const game = CreateGame();
    game.AddPlayer("Matthew1");
    game.AddPlayer("Matthew2")
    game.AddPlayer("Matthew3");

    var ret = game.StartGame();
    expect(ret).toBe(0);
    var players = game.GetPlayers();
    var cards = [];
    for (var i = 0; i < players.length; i++) {
      var hand = game.GetPlayerHand(i);      
      hand.forEach( x=> {
        var index = cards.indexOf(x);
        expect(index).toBe(-1);
        cards.push(x);
      });
      
    }
  });
});
