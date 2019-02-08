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

  it("it should play a game", () => {

    for (var i = 3; i <= 7; i++) {
      const game = CreateGame();

      while (game.GetPlayers().length < i) {
        game.AddPlayer("Matthew" + game.GetPlayers().length);
      }
      const numPlayers = game.GetPlayers().length;
      expect(numPlayers).toBe(i);
      game.StartGame();
      var moderator = game.Moderator();
      //console.log("Moderator: ", moderator);
      var allPlayers = range(game.GetPlayers().length);
      //console.log("All players", allPlayers)
      var otherPlayers = allPlayers.filter(x => x != moderator);
      //console.log("Other players", otherPlayers)
      expect(game.SetDebaters(otherPlayers[0], otherPlayers[1])).toBe(0);
      expect(game.SetTopic("Testing")).toBe(0);
      expect(game.SetDebatorReady(otherPlayers[0])).toBe(0);
      expect(game.SetDebatorReady(otherPlayers[1])).toBe(0);
      expect(game.FinishDebate()).toBe(0);
      var votingPlayers = [moderator].concat(otherPlayers.slice(2));
      var yesPlayer = game.GetYesDebator();
      var noPlayer = game.GetNoDebator();
      expect(yesPlayer).not.toBe(noPlayer);

      votingPlayers.forEach(element => {
        expect(game.SetVote(element, "yes")).toBe(0);
      });
      var startingPressure = game._pressure.reduce((a, b) => a + b, 0);
      expect(startingPressure).toBe(1);
      expect(game.GetPressure(yesPlayer)).toBe(0);
      expect(game.GetPressure(noPlayer)).toBe(1);
      

      var moderator2 = game.Moderator();
      expect(moderator2).not.toBe(moderator);

      while (game.GetState() != "end_game") {
        var rounds = game._GetRound() - 1;
        var moderator = game.Moderator();
        var yesPlayer = game.GetYesDebator();
        var noPlayer = game.GetNoDebator();
        expect(yesPlayer).not.toBe(noPlayer);
        expect(yesPlayer).not.toBe(moderator);
        expect(noPlayer).not.toBe(moderator);

        var totalPressure = game._pressure.reduce((a, b) => a + b, 0);
        var yesPressure = game.GetPressure(yesPlayer);
        var noPressure = game.GetPressure(noPlayer);
        expect(noPressure).toBeLessThan(2);
        expect(yesPressure).toBeLessThan(2);
        expect(game.SetTopic("Testing")).toBe(0);
        expect(game.SetDebatorReady(yesPlayer)).toBe(0);
        expect(game.SetDebatorReady(noPlayer)).toBe(0);
        expect(game.FinishDebate()).toBe(0);
        var votingPlayers = allPlayers.filter(x => x != noPlayer && x != yesPlayer);
        var moderatorVote = "";

        //make sure the debators can't vote
        expect(game.SetVote(noPlayer, "no")).not.toBe(0);
        expect(game.SetVote(yesPlayer, "no")).not.toBe(0);

        votingPlayers.forEach((element, index) => {
          if (index < rounds) expect(game.SetVote(element, "yes")).toBe(0);
          else expect(game.SetVote(element, "no")).toBe(0);
          expect(game.SetVote(element, "no")).not.toBe(0);
          if (element == moderator) moderatorVote = game._GetVote(moderator);
        });
        //make sure moderator and the others can't vote
        expect(game.SetVote(noPlayer, "no")).not.toBe(0);
        expect(game.SetVote(yesPlayer, "no")).not.toBe(0);
        expect(game.SetVote(moderator, "no")).not.toBe(0);

        //sum the pressure before and after
        var afterPressure = game._pressure.reduce((a, b) => a + b, 0);
        //rounds is the number of yes votes
        
        const numVotes = votingPlayers.length;
        //console.log(" votes for yes "+ rounds+" out of "+numVotes);
        if (numVotes % 2 == 0 && rounds == numVotes / 2) { //if we have an even number of voters
          //console.log("Moderator tie breaker");
          if (moderatorVote == "yes") noPressure++;
          else if (moderatorVote == "no") yesPressure++;
        } else if (rounds > numVotes / 2) {
          noPressure++;
          //console.log("no loses");
        } else {
          yesPressure++;
          //console.log("yes loses");

        }
        expect(game.GetPressure(noPlayer)).toBe(noPressure);
        expect(game.GetPressure(yesPlayer)).toBe(yesPressure);
        expect(totalPressure + 1).toBe(afterPressure);

        expect(rounds).toBeLessThan(100); //we expect that it will be different that the last
      }

      //make sure there is only one winner
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