<template>
  <div class="panel">
    <div>List your friends?</div>
    <h3>Add a friend</h3>
    <div class="input-group mb-1">
        <input
            type="email"
            class="form-control"
            v-model="searchtext"
            placeholder="Search for a user's email"
            aria-describedby="search-button"
        />
        <button class="btn btn-success" type="button" id="search-button" :disabled="thinking" @click="searchUser">Search</button>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { defineComponent, Ref, ref, onMounted, computed } from "vue";
import { storeToRefs } from "pinia";
import { useAuthStore } from "@/store/auth";

const store = useAuthStore();

const thinking = ref(false);
const searchtext = ref("");

const isUserTemporary = computed(()=>store.isUserTemporary);
const userName = computed(()=>store.userName);
const loggedIn = computed(()=>store.loggedIn);

async function searchUser() {
    if (thinking.value) return;
    if (searchtext.value == '') return;
    thinking.value = true;
    await store.makeFriend(searchtext.value);
}

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
