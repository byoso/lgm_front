<template>
<div class="container">
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

    <div class="columns">
      <div class="column">
      <router-link class="button is-secondary m-2" to="/change_username">change my username</router-link>

      </div>
      <div class="column">
      <router-link class="button is-secondary m-2" to="/change_email">change my email</router-link>

      </div>
      <div class="column">
      <router-link class="button is-secondary m-2" to="/change_password">change my password</router-link>

      </div>
    </div>

  </div>
  <div class="is-flex is-justify-content-space-around m-4">
    <a href="privacyPolicy.html" target="_blank">Privacy Policy</a>
    <a href="TandC.html" target="_blank">Terms and Conditions</a>
  </div>

  <div v-if="configuration.active_stripe_portal" class="box button" @click="stripePortal">
    <h2 class="subtitle"> Subscriptions and Invoices Portal</h2>
  </div>

</div>
</template>

<script>
import axios from 'axios'


export default {
  name: "AccountView",
  data() {
    return {
      user: {},
      configuration: this.$store.state.configuration,
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
  methods: {
    stripePortal() {
      axios({
        method: 'get',
        url: "dss/portal/",
        headers: {
          'Authorization': "Token " + this.$store.state.token,
        }
      })
      .then(response => {
        console.log(response.data);
        window.location.href = response.data.url
      })
      .catch(error => {
        console.log(error);
      })
    }
  }

}
</script>

<style>

</style>