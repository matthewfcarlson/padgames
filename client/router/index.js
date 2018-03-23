import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '../components/HelloWorld'
import {GameRoutes} from '../../games/'

Vue.use(Router)
var routes = [{
  path: '/',
  name: 'HelloWorld',
  component: HelloWorld
}];

console.log(GameRoutes);
routes.concat(GameRoutes);

export default new Router({
  routes: routes
});