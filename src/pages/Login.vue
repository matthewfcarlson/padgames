<template>
  <div class="login-wrapper text-center">
    <h1>Padgames</h1>
    <div class="background"></div>
    <div class="container">
      <div class="card">
        <div v-if="email_login" class="alert alert-info">An email has been sent! Go check your email and click on the link!</div>
        <div v-if="loading">Thinking....</div>
        <template v-else>
          <h2>To get started playing games, create an account!</h2>
          <br/>
          <div class="alert alert-danger" v-if="error != ''">Error: {{error}}</div>
          <div class="input-group mb-3">
            <input
              type="email"
              class="form-control"
              v-model="email"
              placeholder="Your email"
              aria-describedby="register-button"
            />
            <button class="btn btn-success" type="button" id="register-button" @click="login">Go</button>
          </div>
          <p>
            If you've already created an account, type in your email and we'll send you an email with a link to login
          </p>
          <p class="muted">We promise we won't sell or abuse your email.</p>
          <br /><br />
          <p>Or if you want to just play right away</p>
          <button class="btn btn-secondary btn-lg" @click="loginTemporary">Make a temporary account</button>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineComponent, Ref, ref, onMounted } from "vue";
import { storeToRefs } from "pinia";

import { useAuthStore } from "@/store/auth";
import { useRouter } from "vue-router";

const loading = ref(false);
const email = ref("");
const email_login = ref(false);
const error = ref("");

const router = useRouter();

onMounted(()  => {
    const store = useAuthStore();
    if (store.loggedIn) router.push("/")
    else console.log("Not logged in")
});

async function login(event: Event) {
    const store = useAuthStore();
    error.value = ""
    email_login.value = false;
    
    if (email.value == '') {
      error.value = "Please add your email address";
      return;
    }
    loading.value = true;
    let result = await store.attemptLogin(email.value);
    loading.value = false
    if (!result) {
      error.value = "Login failed"
    }

    if (store.loggedIn) router.push("/")
    else email_login.value = true; 
}

async function loginTemporary(event:Event) {
    const store = useAuthStore();
    console.log(store.currentUser);
    loading.value = true
    email_login.value = false;
    let result = await store.attemptTemporaryLogin();
    loading.value = false
    
    if (result) router.push("/")
    else error.value = "Unable to login temporarily, please contact us!"
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.login-wrapper {
  min-height: 100vh;
  color: white;
}
.background {
  position: absolute;
  background-color: #b3b3b3;
  background-image: url(https://img.itch.zone/aW1nLzcxNDM2NzIucG5n/original/jTj1pz.png);
  background-repeat: repeat;
  background-position: 50% 0;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  overflow: hidden;
  z-index: -1; /* Remove this line if it's not going to be a background! */
}
.card {
  color: black;
  padding: 2em;
}
h1 {
  padding-top: 20vh;
  letter-spacing: -0.05em;
  font-weight: 900;
  vertical-align: middle;
  font-size: 9rem;
  line-height: 75%;
  vertical-align: text-top;
  color: white;
  margin-bottom:0.5em;
}
// h1::first-letter {
//   vertical-align: text-bottom;
//   line-height: 100%;
//   font-size: 14rem;
// }
</style>
