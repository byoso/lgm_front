<template>
<div class="container">
  <h1 class="title">Subscriptions</h1>

    <button @click="subscribe('price_1NT4BqCyzfytDBEqarffvBjA')">5 € subscription</button>

</div>

</template>

<script>
import axios from "axios"

export default {
  name: "SubscriptionsView",
  methods: {
    subscribe(priceId) {
      axios({
        method: "POST",
        url: "campains/subscriptions/create-checkout-session/",
        headers: {
          "Authorization": "Token " + this.$store.state.token,
        },
        data: {
          priceId: priceId,
        },
      }).then(response => {
        console.log(response.data.message)
      }).catch(error => {
        console.log(error.message)
      })
    },
  },

}
</script>

<style>

</style>