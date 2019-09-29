<template>
  <nav class="navbar navbar-expand-lg navbar-light container" role="navigation">
    <a class="navbar-brand font-weight-bold ml-lg-4" href="/">padgames</a>
    <button
      class="navbar-toggler"
      type="button"
      data-toggle="collapse"
      data-target="#navbarSupportedContent"
      aria-controls="navbarSupportedContent"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span class="navbar-toggler-icon"></span>
    </button>

    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav ml-auto mr-lg-4">
        <router-link
          :to="'/'+curr_route"
          v-slot="{ href, route, navigate, isActive }"
          v-for="curr_route in routes"
          :key="curr_route"
        >
          <li class="nav-item" :class="{ active: isActive }">
            <a class="nav-link" :href="href" @click="navigate">{{ curr_route }}</a>
          </li>
        </router-link>
        <!-- TODO finish authentication -->
        <!--li class="nav-item">
          <router-link class="nav-link" to="/login">login</router-link>
        </li-->
      </ul>
    </div>
  </nav>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class NavBar extends Vue {
  //TODO read in data from routes.dynamic.ts
  routes = ["games", "pricing", "about"];
  //TODO figure out if we're logged in?
}
</script>

<style scoped lang="scss">
$animate: all 0.2s ease-in-out;

.nav-item {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;  
  .nav-link {
    position: relative;
    transition: $animate;
    &:before,
    &:after {
      content: "";
      position: absolute;
      bottom: -2px;
      width: 0px;
      height: 5px;
      margin: 5px 0 0;
      transition: $animate;
      transition-duration: 0.20s;
      opacity: 0;
    }
    &:after, &:before {
      left: 0;
      background-color: purple;
    }
  }
  &.active {
    .nav-link{
      &:after {
        height: 1px;
      }
    }
  }  
  &:hover {
    cursor: pointer;
    .nav-link {
      &:before {
        width: 100%;
        opacity: 1.0;
      }
    }
  }
  &.active {
    cursor: pointer;
    .nav-link {
      &:after {
        width: 100%;
        opacity: 1.0;
      }
    }
  }
}
</style>

