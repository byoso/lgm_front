<template>

<div class="container is-max-desktop">

  <h1 class="title">Login</h1>


  <p class="label">Enter a credential</p>
  <input type="text" placeholder="Email or username" v-model="credential" required class="input">

  <p class="label">Enter your password</p>
  <input type="password" placeholder="Password" v-model="password" required class="input">
  <br>


  <button class="button is-success mt-2" @click="onSubmit">Login</button>
  <p class="m-2"><router-link to="/forgotten_password" >I forgot my password</router-link></p>
  <p class="m-2"><router-link to="/send_confirmation_email_again">I already have an account, but please send me the confirmation email again</router-link></p>



</div>


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
    }
  },
  methods: {
    onSubmit() {

      if (this.credential === '' || this.password === '') {
        return;
      }
      axios({
        method: 'post',
        url: 'users/token/login/',
        data: {
          credential: this.credential,
          password: this.password,
        },
      })
      .then(response => {
        this.$store.commit('setToken', response.data.auth_token);
        this.$store.state.user = response.data.user;
        console.log(this.$store.state.user)

        toast({
          message: `Logged in`,
          type: 'is-success',
          position: 'bottom-right',
          dismissible: true,
          pauseOnHover: true,
          duration: 3000,
        });
        this.$router.push({ name: 'dashboard' })
      })
      .catch(error => {
        if (error.response != undefined) {
          let message = ""
          for (var key in error.response.data) {
            for (var i = 0; i < error.response.data[key].length; i++) {
              message += error.response.data[key][i] + "\n"
            }
          }

          toast({
            message: `${message}`,
            type: 'is-danger',
            position: 'center',
            dismissible: true,
            pauseOnHover: true,
            duration: 3000,
          });

        }
      });
    },
  },
}
</script>

<style>

</style>