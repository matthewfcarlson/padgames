<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-fluid">
      <a class="navbar-brand" href="/">Padgames</a>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarTogglerDemo02"
        aria-controls="navbarTogglerDemo02"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarTogglerDemo02">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">

        </ul>
        <span class="navbar-text">
          <i v-if="isUserTemporary" class="fas fa-user-clock"></i>
          <i v-else class="fas fa-user"></i>
          {{ userName || "unknown user" }}
          <template v-if="loggedIn">
            <a href="/logout" class="btn btn-sm btn-outline-info"> Logout</a>
          </template>
        </span>
      </div>
    </div>
  </nav>
</template>

<script lang='ts'>
import { Component, Prop, Vue, Watch } from "vue-property-decorator"
import { mapGetters } from "vuex"

@Component({
  computed: {
    ...mapGetters(["isUserTemporary", "userName", "loggedIn"])
  }
})
export default class NavBar extends Vue {}
</script>

<style lang="scss">
#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
