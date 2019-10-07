<template>
  <div>
    <p class="lead mb-0" v-if="showText">Want to be updated on everything going on?</p>
    <div v-if="subscribed" class="text-center">
      <i class="far fa-laugh-wink fa-3x"></i><br>
      <p class="lead">Thanks for subscribing</p>
    </div>
    <div v-else-if="subscribing" class="text-center">
      <div class="spinner-border" role="status">
        <span class="sr-only">Loading...</span>
      </div>
      <p>Subscribing you now</p>
    </div>
    <div v-else>
      <p v-if="showText">
        Signup for our our monthlyish newsletter! We'll never give your email away.
        <br />
      </p>
      <form
        action="https://app.mailerlite.com/webforms/submit/u6p7v6"
        data-code="u6p7v6"
        method="post"
        target="_blank"
        @submit="subscribeToNewsLetter"
      >
        <input type="hidden" name="ml-submit" value="1" />
        <div class="input-group">
          <input
            type="email"
            class="form-control"
            data-inputmask
            name="fields[email]"
            v-model="email"
            value
            placeholder="Email"
            aria-label="Recipient's email"
          />
          <div class="input-group-append">
            <button type="submit" class="btn btn-primary btn-sm">Subscribe</button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import axios from 'axios'

@Component
export default class NewsLetter extends Vue {
  subscribed = false;
  subscribing = false;
  error = false;
  email = "";
  campaign = "u6p7v6";

  @Prop({default: true}) private showText!: boolean;

  subscribeToNewsLetter(e: Event) {
    console.log(e);
    e.preventDefault();
    this.subscribing = true;
    this.error = false;
    const email_encoded = encodeURI(this.email);
    console.log(email_encoded);
    const request_url = `https://app.mailerlite.com/webforms/submit/${this.campaign}?callback=jQuery183018512865745406493_test&fields%5Bemail%5D=${email_encoded}&ml-submit=1&ajax=1`;
    var self = this;
    axios.get(request_url).then((response) => {
      console.log(response);
      self.subscribing = false;
      if (response.status == 200) self.subscribed = true;
      else self.error = true;
    });

    // TODO send AJAX request to mail
  }
}
</script>
