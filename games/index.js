import SushiClient from "./sushigo/client/Sushi";
import SushiLobby from "./sushigo/client/lobby";
import CWClient from "./codewords/client/CodeWords";
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
    path: "/codewords/testai",
    name: "codewords",
    title: "Code Words AT",
    isGame: false,
    component: TestAI
  }
];
