<template>
  <div class="login-wrapper text-center">
    <h1>Keeyp</h1>
    <div class="background"></div>
    <div class="container">
      <div class="card">
        <div v-if="emailLogin" class="alert alert-info"> An email has been sent! Go check your email and click on the link! </div>
        <div v-if="loading">Thinking....</div>
        <template v-else>
          <h2>To get started playing Keeyp, create an account!</h2>
          <br />
          <div class="alert alert-danger" v-if="error != ''">Error: {{ error }}</div>
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
          <br /><br /><br />
          <p>Or if you want to just play right away</p>
          <button class="btn btn-secondary btn-lg" @click="loginTemporary">Make a temporary account</button>
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator"
import router from "../router"
import { storeMapper } from "@/store"
import { MainStoreState } from "@/store/main.store"
import { mapGetters } from "vuex"

interface Data {
  loading: boolean
  email: string
  emailLogin: boolean
  error: string
  timer: NodeJS.Timer | null
}

@Component
export default class LoginView extends Vue {
  @Prop() private msg!: string
  data(): Data {
    return {
      loading: false,
      email: "",
      emailLogin: false,
      error: "",
      timer: null
    }
  }

  mounted() {
    if (this.$store.getters.loggedIn) this.$router.push("/")
  }

  async login() {
    const data = (this as any) as Data
    data.error = ""
    data.emailLogin = false;
    data.loading = true;
    const result = await this.$store.dispatch("attemptLogin", data.email)
    data.loading = false
    // TODO: check what we actually get
    if (!result) {
      data.error = "Login failed"
    }
    if (this.$store.getters.loggedin) router.push("/")
    else data.emailLogin = true;
  }
  async loginTemporary() {
    const data = (this as any) as Data
    data.loading = true
    data.emailLogin = false;
    const result = await this.$store.dispatch("attemptTemporaryLogin")
    if (result) router.push("/")
    else data.error = "Unable to login temporarily, please contact us!"
    data.loading = false
  }
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
  -webkit-text-stroke-color: black;
  -webkit-text-stroke-width: 8px;
}
h1::first-letter {
  vertical-align: text-bottom;
  line-height: 100%;
  font-size: 14rem;
}
</style>
