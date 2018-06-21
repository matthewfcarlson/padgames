import SushiClient from "./sushigo/client/Sushi";
import SushiLobby from "./sushigo/client/lobby";
import CWClient from "./codewords/client/CodeWords";
import GoSLobby from "./stuff/client/lobby";
import GoSGame from "./stuff/client/game";
import TestAI from "./codewords/client/TestAI";

export const GameRoutes = [
  /* This is the format
    {
        path: '/',
        name: 'HelloWorld',
        component: HelloWorld
      }];*/
  {
    path: "/sushi",
    name: "Sushi-to-go-lobby",
    title: "Sushies On The Go",
    isGame: true,
    component: SushiLobby
  },
  {
    path: "/sushi/:gameID",
    name: "Sushi-on-the-go",
    title: "Sushies",
    isGame: false,
    component: SushiClient
  },
  {
    path: "/codewords",
    name: "codewords",
    title: "Code Words",
    isGame: true,
    component: CWClient
  },
  {
    path: "/stuff",
    name: "stuff",
    title: "Game Of Stuff",
    isGame: true,
    component: GoSLobby
  },
  {
    path: "/stuff/:gameID",
    name: "stuff-game",
    title: "Game of Stuff",
    isGame: false,
    component: GoSGame
  },
  {
    path: "/codewords/testai",
    name: "codewords-testAI",
    title: "Code Words AT",
    isGame: false,
    component: TestAI
  }
];
