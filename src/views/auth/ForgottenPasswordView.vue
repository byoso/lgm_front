<template>

<div class="container is-max-desktop">
  <form>
  <h1 class="title">Forgotten password</h1>

  <p class="label">Enter your email or your username</p>
  <input type="text" placeholder="Email or username" v-model="credential" required class="input">

  <div v-if="errors.length">
    <ul>
      <li v-for="error in Object.values(errors[0])" :key="error" style="color: red;">
        {{ error[0] }}
      </li>
    </ul>
  </div>

  <button class="button is-success mt-2" @click="onSubmit">Send me an email to reset my password</button>

  </form>
</div>



</template>

<script>
import axios from 'axios';
import { toast } from 'bulma-toast';


export default {
  name: 'ForgottenPasswordView',
  components: {
  },
  data() {
    return {
      credential: '',
      errors: [],
    }
  },
  methods: {
    onSubmit() {
      this.errors = [];
      axios.post("/auth/password/request_reset/", {
        credential: this.credential,
      })
      .then(response => {
        console.log(response.data)
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
        console.log(error.response.data);
      })
    },
  }

}
</script>

<style>

</style>