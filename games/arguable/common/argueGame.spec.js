const CreateGame = require(appRoot + "/games/arguable/common/argueGame").CreateGame;

function range(size, startAt = 0) {
  return [...Array(size).keys()].map(i => i + startAt);
}


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

  it("it should let me vote", () => {

    for (var i = 3; i <= 5; i++) {
      const game = CreateGame();
      while (game.GetPlayers().length < i) {
        game.AddPlayer("Matthew" + game.GetPlayers().length);
      }
      game.StartGame();
      var moderator = game.Moderator();
      console.log("Moderator: ", moderator);
      var allPlayers = range(game.GetPlayers().length);
      console.log("All players", allPlayers)
      var otherPlayers = allPlayers.filter(x => x != moderator);
      console.log("Other players", otherPlayers)
      expect(game.SetDebaters(otherPlayers[0], otherPlayers[1])).toBe(0);
      expect(game.SetTopic("Testing")).toBe(0);
      expect(game.SetDebatorReady(otherPlayers[0])).toBe(0);
      expect(game.SetDebatorReady(otherPlayers[1])).toBe(0);
      expect(game.FinishDebate()).toBe(0);
      var votingPlayers = [moderator].concat(otherPlayers.slice(2));
      console.log("Voting players", votingPlayers)
      var yesPlayer = game.GetYesDebator();
      var noPlayer = game.GetNoDebator();
      expect(yesPlayer).not.toBe(noPlayer);

      votingPlayers.forEach(element => {
        expect(game.SetVote(element, "yes")).toBe(0);
      });
      expect(game.GetPressure(noPlayer)).toBe(1);
      expect(game.GetPressure(yesPlayer)).toBe(0);

      var moderator2 = game.Moderator();
      expect(moderator2).not.toBe(moderator);

      var rounds = 0;
      while (game.GetState() != "end_game") {
        var moderator = game.Moderator();
        var yesPlayer = game.GetYesDebator();
        var noPlayer = game.GetNoDebator();
        expect(yesPlayer).not.toBe(noPlayer);
        expect(yesPlayer).not.toBe(moderator);
        expect(noPlayer).not.toBe(moderator);
        var yesPressure = game.GetPressure(yesPlayer);
        var noPressure = game.GetPressure(noPlayer);
        expect(noPressure).toBeLessThan(2);
        expect(yesPressure).toBeLessThan(2);
        expect(game.SetTopic("Testing")).toBe(0);
        expect(game.SetDebatorReady(yesPlayer)).toBe(0);
        expect(game.SetDebatorReady(noPlayer)).toBe(0);
        expect(game.FinishDebate()).toBe(0);
        var votingPlayers = allPlayers.filter(x => x != noPlayer && x != yesPlayer);
        votingPlayers.forEach(element => {
          expect(game.SetVote(element, "yes")).toBe(0);
        });
        expect(game.GetPressure(noPlayer)).toBe(noPressure + 1);
        expect(game.GetPressure(yesPlayer)).toBe(yesPressure);
        expect(rounds).toBeLessThan(100); //we expect that it will be different that the last
        rounds++;
      }
      var remainingPlayers = game._pressure.filter(x => x < 2).length;
      expect(remainingPlayers).toBe(1);

    }



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
});