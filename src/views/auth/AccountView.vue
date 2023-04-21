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
        <a>change my username</a>
        <a>change my email</a>
        <a>change my password</a>
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
    })
    .catch(error => {
      console.log(error);
    })
  },

}
</script>

<style>

</style>