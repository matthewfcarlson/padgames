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
          <template v-if="loggedIn">
            <i v-if="isUserTemporary" class="fas fa-user-clock"></i>
            <i v-else class="fas fa-user"></i>
            {{ userName || "unknown user" }}
            <a href="/logout" class="btn btn-sm btn-outline-info"> <i class="fas fa-user"></i> Logout</a>
          </template>
          <template v-else>
              <a href="/login" class="btn btn-sm btn-outline-info"> <i class="fas fa-user"></i> Login </a>
          </template>
        </span>
      </div>
    </div>
  </nav>
</template>

<script setup lang='ts'>
import { defineComponent, Ref, ref, onMounted, computed } from "vue";
import { storeToRefs } from "pinia";
import { useAuthStore } from "@/store/auth";

const store = useAuthStore();

const isUserTemporary = computed(()=>store.isUserTemporary);
const userName = computed(()=>store.userName);
const loggedIn = computed(()=>store.loggedIn);

</script>

<style scoped lang="scss">
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
