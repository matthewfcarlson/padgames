import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '../components/HelloWorld'
import NotFoundComponent from '../components/NotFound'
import {
  GameRoutes
} from '../../games/'

Vue.use(Router)
var routes = [{
    path: '/',
    name: 'HelloWorld',
    component: HelloWorld
  },

];

routes = routes.concat(GameRoutes);
//the 404 needs to go last
routes.push( {
  path: '*',
  component: NotFoundComponent
});

export default new Router({
  routes: routes,
  //abstract: true,
  history: true,
  mode: 'history'  
});