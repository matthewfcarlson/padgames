import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '../components/HelloWorld'
import GamesRoutes from '../../games'

Vue.use(Router)
var routes = [{
  path: '/',
  name: 'HelloWorld',
  component: HelloWorld
}];

console.log(GamesRoutes);
routes.concat(GamesRoutes);

export default new Router({
  routes: routes
});