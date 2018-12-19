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
      hand.forEach(x => {
        var index = cards.indexOf(x);
        expect(index).toBe(-1);
        cards.push(x);
      });

    }
  });

  it("the story teller should be able to play a card", () => {
    const game = CreateGame();
    game.AddPlayer("Matthew1");
    game.AddPlayer("Matthew2")
    game.AddPlayer("Matthew3");

    var ret = game.StartGame();
    expect(ret).toBe(0);
    var storyTeller = game.GetStoryTeller();
    var hand = game.GetPlayerHand(storyTeller);
    var firstCard = hand[0];
    ret = game.PickCard(storyTeller, firstCard);
    expect(ret).toBe(0);
  });

  it("the story teller can't play a card that isn't in their hand", () => {
    const game = CreateGame();
    game.AddPlayer("Matthew1");
    game.AddPlayer("Matthew2")
    game.AddPlayer("Matthew3");

    var ret = game.StartGame();
    expect(ret).toBe(0);
    var storyTeller = game.GetStoryTeller();
    var hand = game.GetPlayerHand(storyTeller);

    var firstCard = hand[0] + 1;
    while (hand.indexOf(firstCard) != -1) firstCard += 1;

    ret = game.PickCard(storyTeller, firstCard);
    expect(ret).not.toBe(0);
  });

  it("other players that aren't the story teller shouldn't be able to play a card", () => {
    const game = CreateGame();
    game.AddPlayer("Matthew1");
    game.AddPlayer("Matthew2")
    game.AddPlayer("Matthew3");

    var ret = game.StartGame();
    expect(ret).toBe(0);
    var storyTeller = game.GetStoryTeller();
    var otherPlayer = storyTeller - 1;
    if (otherPlayer < 0) otherPlayer = game.GetPlayers().length - 1;

    var hand = game.GetPlayerHand(otherPlayer);
    var firstCard = hand[0];
    ret = game.PickCard(otherPlayer, firstCard);
    expect(ret).not.toBe(0);
  });

  it("the story teller loses a card once they pick theirs", () => {
    const game = CreateGame();
    game.AddPlayer("Matthew1");
    game.AddPlayer("Matthew2")
    game.AddPlayer("Matthew3");

    var ret = game.StartGame();
    expect(ret).toBe(0);
    var storyTeller = game.GetStoryTeller();
    var hand = game.GetPlayerHand(storyTeller);
    var handLength = hand.length;

    var firstCard = hand[0];
    ret = game.PickCard(storyTeller, firstCard);
    expect(ret).toBe(0);
    hand = game.GetPlayerHand(storyTeller);
    var newHandLength = hand.length;

    expect(handLength - newHandLength).toBe(1);

  });
  it("other players can pick cards after the story teller", () => {
    const game = CreateGame();
    game.AddPlayer("Matthew1");
    game.AddPlayer("Matthew2")
    game.AddPlayer("Matthew3");

    var ret = game.StartGame();
    expect(ret).toBe(0);
    var storyTeller = game.GetStoryTeller();
    var hand = game.GetPlayerHand(storyTeller);
    var firstCard = hand[0];
    ret = game.PickCard(storyTeller, firstCard);
    expect(ret).toBe(0);

    for (var i = 0; i < game.GetPlayers().length; i++) {
      if (i == storyTeller) continue;
      hand = game.GetPlayerHand(i);
      var handLength = hand.length;
      ret = game.PickCard(i, hand[0]);
      expect(ret).toBe(0);
      hand = game.GetPlayerHand(i);
      expect(handLength - hand.length).toBe(1);
    }
  });
  it("other players can't play their cards twice", () => {
    const game = CreateGame();
    game.AddPlayer("Matthew1");
    game.AddPlayer("Matthew2")
    game.AddPlayer("Matthew3");

    var ret = game.StartGame();
    expect(ret).toBe(0);
    var storyTeller = game.GetStoryTeller();
    var hand = game.GetPlayerHand(storyTeller);
    var firstCard = hand[0];
    ret = game.PickCard(storyTeller, firstCard);
    expect(ret).toBe(0);

    for (var i = 0; i < game.GetPlayers().length; i++) {
      if (i == storyTeller) continue;
      hand = game.GetPlayerHand(i);
      ret = game.PickCard(i, hand[0]); //play the first 
      expect(ret).toBe(0);      
      hand = game.GetPlayerHand(i);
      ret = game.PickCard(i, hand[0]);
      expect(ret).not.toBe(0);      
      
    }
    // no one can play another card
    for (var i = 0; i < game.GetPlayers().length; i++) {      
      hand = game.GetPlayerHand(i);
      ret = game.PickCard(i, hand[0]);
      expect(ret).not.toBe(0);
    }
  });
  it("other players can't play their cards twice", () => {
    const game = CreateGame();
    game.AddPlayer("Matthew1");
    game.AddPlayer("Matthew2")
    game.AddPlayer("Matthew3");

    var ret = game.StartGame();
    expect(ret).toBe(0);
    var storyTeller = game.GetStoryTeller();
    var hand = game.GetPlayerHand(storyTeller);
    var firstCard = hand[0];
    ret = game.PickCard(storyTeller, firstCard);
    expect(ret).toBe(0);

    for (var i = 0; i < game.GetPlayers().length; i++) {
      if (i == storyTeller) continue;
      hand = game.GetPlayerHand(i);
      ret = game.PickCard(i, hand[0]); //play the first 
      expect(ret).toBe(0);      
      hand = game.GetPlayerHand(i);
      ret = game.PickCard(i, hand[0]);
      expect(ret).not.toBe(0);      
      
    }
    // no one can play another card
    for (var i = 0; i < game.GetPlayers().length; i++) {      
      hand = game.GetPlayerHand(i);
      ret = game.PickCard(i, hand[0]);
      expect(ret).not.toBe(0);
    }
  });
});
