const CreateGame = require(appRoot + "/games/arguable/common/argueGame").CreateGame;

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
    game.AddPlayer("Matthew4")
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

  it("should pick a moderator", () => {
    const game = CreateGame();
    game.AddPlayer("Matthew1");
    game.AddPlayer("Matthew2")
    game.AddPlayer("Matthew3");
    var state = game.GetState();
    expect(game.Moderator()).toEqual(-1)
    game.StartGame();
    var moderator = game.Moderator();
    expect(game.Moderator()).toBeGreaterThan(-1);
    expect(game.Moderator()).toBeLessThan(game.GetPlayers().length);
  });
  it("should pick a moderator", () => {
    const game = CreateGame();
    game.AddPlayer("Matthew1");
    game.AddPlayer("Matthew2")
    game.AddPlayer("Matthew3");
    var state = game.GetState();
    expect(game.Moderator()).toEqual(-1)
    game.StartGame();
    var moderator = game.Moderator();
    expect(game.Moderator()).toBeGreaterThan(-1);
  });
});
