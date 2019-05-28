//import SushiClient from "./sushigo/client/Sushi";
import SushiLobby from "./sushigo/client/lobby";
import CWClient from "./codewords/client/CodeWords";
import GoSLobby from "./stuff/client/lobby";
import GoSGame from "./stuff/client/game";
import TestAI from "./codewords/client/TestAI";
import ArgueLobby from "./arguable/client/ArgueLobby"
//import ArgueGame from "./arguable/client/ArgueGameView"
import DixitLobby from "./dixit/client/DixitLobby"
//import DixitGame from "./dixit/client/DixitGame"

export const GameRoutes = [
  
  /* This is the format
    {
        path: '/',
        name: 'HelloWorld',
        component: HelloWorld,
        isGame: false, //this determines if it is listed (games are not)
      }];*/
  
  {
    path: "/sushi",
    name: "Sushi-to-go-lobby",
    title: "Sushies On The Go",
    isGame: true,
    component: SushiLobby
  },
  {
    path: "/argue",
    name: "Arguable-lobby",
    title: "Arguable",
    isGame: true,
    component: ArgueLobby
  },
  {
    path: "/argue/:gameID",
    name: "Arguable-Game",
    title: "Arguable",
    isGame: false,
    component: () => import("./arguable/client/ArgueGameView") // ArgueGame
  },
  {
    path: "/sushi/:gameID",
    name: "Sushi-on-the-go",
    title: "Sushies",
    isGame: false,
    component:  () => import("./sushigo/client/Sushi") // SushiClient
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
  },
  {
    path: "/dixit",
    name: "dixit",
    title: "Dixit",
    isGame: true,
    component: DixitLobby
  },
  {
    path: "/dixit/:gameID",
    name: "dixit game",
    title: "Dixit",
    isGame: false,
    component: () => import("./dixit/client/DixitGame") //DixitGame
  },
  {
    path: "/test-dixit",
    name: "dixit game test",
    title: "Dixit",
    isGame: false,
    component: () => import("./dixit/client/Test") //DixitGame
  },
  {
    path: "/gameshow",
    name: "YM/YW gameshow",
    title: "Gameshow",
    isGame: true,
    component: () => import("./gameshow/client/Gameshow") //Gameshow
  },
  {
    path: "/stocks",
    name: "Matt Stocks",
    title: "Matt Stocks",
    isGame: true,
    component: () => import("./mattstocks/client/Stocks") //Matt Stocks
  }

];
