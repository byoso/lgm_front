<template>
<div class="container is-max-desktop">
  <form>
    <h1 class="title">Send me the confirmation email again</h1>


    <label class="label">Credential</label>
    <input type="text" placeholder="Email or username" v-model="credential" required class="input">


    <div v-if="errors.length">
      <ul>
        <li v-for="error in Object.values(errors[0])" :key="error" style="color: red;">
          {{ error[0] }}
        </li>
      </ul>
    </div>

    <button class="button is-success mt-2" @click="onSubmit">Send the email</button>

  </form>

</div>
</template>

<script>
import axios from 'axios'
import { toast } from 'bulma-toast'

export default {
  name: 'SendConfirmationEmailAgainView',
  data() {
    return {
      credential: '',
      errors: [],
    }
  },
  methods: {
    onSubmit(){
      console.log("click !")
      this.errors = [];
      axios.post('auth/email/confirm_email/resend/', {
        credential: this.credential,
      })
      .then(response => {
        toast({
          message: 'The email has been sent, please check your inbox',
          type: 'is-info',
          position: 'bottom-right',
          dismissible: true,
          pauseOnHover: true,
          duration: 5000,
        })
        this.$router.push({ name: 'home' })
      })
      .catch(error => {
        this.errors.push(error.response.data);
      })
    }
  },

}
</script>

<style>
.form {
  width: 50%;
  margin: auto;
}

</style>