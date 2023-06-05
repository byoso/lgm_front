<template>
  <div class="box mt-4">

      <h1 class="subtitle">Account informations</h1>
      <hr>
      <p>
        <span>
          Username: {{ user.username }}
        </span>

      </p>
      <p>
        <span>
          Email: {{ user.email }}
        </span>

      </p>

      <p class="is-flex is-justify-content-space-around">
        <router-link to="/change_username">change my username</router-link>
        <router-link to="/change_email">change my email</router-link>
        <router-link to="/change_password">change my password</router-link>
      </p>





  </div>
</template>

<script>
import axios from 'axios'


export default {
  name: "AccountView",
  data() {
    return {
      user: {},
    }
  },
  beforeMount() {
    axios.get(`auth/users/my_infos/`, {
      headers: {
        Authorization: `Token ${this.$store.state.token}`,
      }
    })
    .then(response => {
      this.user = response.data;
      this.$store.user = this.user;
    })
    .catch(error => {
      console.log(error);
    })
  },

}
</script>

<style>

</style>