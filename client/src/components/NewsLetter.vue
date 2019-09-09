<template>
  <div id="mlb2-1488508" class="ml-form-embedContainer ml-subscribe-form ml-subscribe-form-1488508">
    <div class="ml-form-align-center">
      <div class="ml-form-embedWrapper embedForm">
        <div class="ml-form-embedBody ml-form-embedBodyHorizontal row-form">
          <div class="ml-form-embedContent" style=" ">
            <h4>Want to be updated on everything going on?</h4>
            <p>
              Signup for our our monthlyish newsletter to hear the latest news! We'll never give your email away. Maybe we'll even throw in some goodies for email subscribers!
              <br />
            </p>
          </div>
          <form
            class="ml-block-form"
            action="https://app.mailerlite.com/webforms/submit/u6p7v6"
            data-code="u6p7v6"
            method="post"
            target="_blank"
          >
            <div class="ml-form-formContent horozintalForm">
              <div class="ml-form-horizontalRow">
                <div class="ml-input-horizontal">
                  <div style="width: 100%;" class="horizontal-fields">
                    <div
                      class="ml-field-group ml-field-email ml-validate-email ml-validate-required"
                    >
                      <input
                        style="width: 100%;"
                        type="email"
                        class="form-control"
                        data-inputmask
                        name="fields[email]"
                        value
                        placeholder="Email"
                      />
                    </div>
                  </div>
                </div>
                <input type="hidden" name="ml-submit" value="1" />
                <div class="ml-button-horizontal">
                  <button type="submit" class="primary">Subscribe</button>
                  <button disabled="disabled" style="display: none;" type="button" class="loading">
                    <div class="ml-form-embedSubmitLoad"></div>
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
//TODO modify the vue js code to handle webform logic - we should send a post to the website!
// Look to see what their code does and try to replicate it?
import { Component, Vue } from "vue-property-decorator";

@Component
export default class NewsLetter extends Vue {}
</script>
