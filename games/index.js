import SushiClient from "./sushigo/client/Sushi";
import SushiLobby from "./sushigo/client/lobby";
import CWClient from "./codewords/client/CodeWords";

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
    title: "Sushies Lobby",
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
    component: CWClient
  }
];
