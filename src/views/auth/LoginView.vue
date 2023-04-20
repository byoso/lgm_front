<template>

<form class="form">
<h1 class="title">Login</h1>


<p class="label">Enter a credential</p>
<input type="text" placeholder="Email or username" v-model="credential" required class="input">

<p class="label">Enter your password</p>
<input type="password" placeholder="Password" v-model="password" required class="input">
<br>


<div v-if="errors.length">
  <ul>
    <li v-for="error in Object.values(errors[0])" :key="error" style="color: red;">
      {{ error[0] }}
    </li>
  </ul>
</div>

<button class="button is-success mt-2" @click="onSubmit">Login</button>
<p class="m-2"><a href="" >I forgot my password</a></p>
<p class="m-2"><a href="">I already have an account, but please send me the confirmation email again</a></p>

</form>


</template>

<script>

import axios from 'axios';
import { toast } from 'bulma-toast';
import store from '../../store';


export default {
  name: 'LoginView',
  components: {
  },
  data() {
    return {
      credential: '',
      password: '',
      errors: [],
    }
  },
  beforeMount() {
    console.log("is authenticated: ", this.$store.state.isAuthenticated)
  },
  methods: {
    onSubmit() {
      if (this.credential === '' || this.password === '') {
        return;
      }
      this.errors = [];
      axios.post('auth/token/login/', {
        credential: this.credential,
        password: this.password,
      })
      .then(response => {
        this.servers = response.data;
        console.log("token :",response.data.auth_token);
        this.$store.commit('setToken', response.data.auth_token);

        toast({
          message: `Logged in`,
          type: 'is-success',
          position: 'bottom-right',
          dismissible: true,
          pauseOnHover: true,
          duration: 3000,
        });
      })
      .catch(error => {
      this.errors.push(error.response.data);
      });
    },
  },
}
</script>

<style>
.form {
  width: 50%;
  margin: auto;
}

</style>