<template>
  <div>
    <p class="lead mb-0">Want to be updated on everything going on?</p>
    <div v-if="subscribed" class="text-center">
      <p class="lead">Thanks for subscribing</p>
    </div>
    <div v-else-if="subscribing" class="text-center">
      <div class="spinner-border" role="status">
        <span class="sr-only">Loading...</span>
      </div>
      <p>Subscribing you now</p>
    </div>
    <div v-else>
      <p>
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
//TODO modify the vue js code to handle webform logic - we should send a post to the website!
// Look to see what their code does and try to replicate it?
import { Component, Vue } from "vue-property-decorator";

@Component
export default class NewsLetter extends Vue {
  subscribed = false;
  subscribing = false;

  subscribeToNewsLetter(e: Event) {
    console.log(e);
    e.preventDefault();
    this.subscribing = true;

    // TODO send AJAX request to mail
  }
}
</script>
