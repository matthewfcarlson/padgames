import SushiClient from "./sushigo/client/Sushi"

export const GameRoutes = [{
    /* This is the format
    {
        path: '/',
        name: 'HelloWorld',
        component: HelloWorld
      }];*/
    path: '/sushi',
    name: 'Sushi-on-the-go',
    component: SushiClient
}];
