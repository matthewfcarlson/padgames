<template>
  <div>
    <p class="lead mb-0">Want to be updated on everything going on?</p>
    <p>
      Signup for our our monthlyish newsletter! We'll never give your email away.
      <br />
    </p>
    <form
      action="https://app.mailerlite.com/webforms/submit/u6p7v6"
      data-code="u6p7v6"
      method="post"
      target="_blank"
    >
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
    <!--div class="ml-form-align-center">
      <div class="ml-form-embedWrapper embedForm">
        <div class="ml-form-embedBody ml-form-embedBodyHorizontal row-form">
          <div class="ml-form-embedContent" style=" ">
            
          </div>
          
            <div class="ml-form-formContent horozintalForm">
              <div class="ml-form-horizontalRow">
                <div class="ml-input-horizontal">
                  <div style="width: 100%;" class="horizontal-fields">
                    <div
                      class="ml-field-group ml-field-email ml-validate-email ml-validate-required"
                    >
                     
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
    </div-->
  </div>
</template>

<script lang="ts">
//TODO modify the vue js code to handle webform logic - we should send a post to the website!
// Look to see what their code does and try to replicate it?
import { Component, Vue } from "vue-property-decorator";

@Component
export default class NewsLetter extends Vue {}
</script>
