<template>
<div class="container is-max-desktop">
  <form>
  <h1 class="title">Please confirm your identity</h1>
  <h2 class="subtitle">Confirm your account, then change your password if needed</h2>

  <p>Use this token: </p><p>{{ jwt_token }}</p>


  <p class="label mt-2">Enter your email or username</p>
  <input type="text" placeholder="Email or username" v-model="credential" required class="input">


  <div v-if="errors.length">
    <ul>
      <li v-for="error in Object.values(errors[0])" :key="error" style="color: red;">
        {{ error[0] }}
      </li>
    </ul>
  </div>

  <button class="button is-success mt-2" @click="onSubmit">login</button>

  </form>
</div>


</template>

<script>
import axios from 'axios';
import { toast } from 'bulma-toast';

export default {
  name: "LoginFromEmailView",
  data(){
    return {
      jwt_token: '',
      credential: '',
      errors: [],
    }
  },
  methods: {
    onSubmit() {
      axios.post(`auth/login_with_jwt/`, {
        credential: this.credential,
        jwt_token: this.jwt_token,
      })
      .then(response => {
        toast({
          message: 'You are now logged in and confirmed!',
          type: 'is-success',
          position: 'bottom-right',
          dismissible: true,
          pauseOnHover: true,
          duration: 5000,
        })
        this.$store.commit('setToken', response.data.auth_token);
        this.$store.state.user = response.data.user;
        this.$router.push({ name: 'account' })
      })
      .catch(error => {
        this.errors.push(error.response.data);
      })
    },
  },
  beforeMount() {
    this.jwt_token = this.$route.params.token
  },

}
</script>

<style>
p {
    word-break: break-all;
    white-space: normal;
}

</style>