<template>
<div class="container">
  <h1 class="title">Subscriptions</h1>

    <div class="box" v-for="plan in plans" @click="subscribe(plan.id)" :key="plan.id">
        <h2 class="subtitle" style="color: white;">{{ plan.product.name }}</h2>
        <hr>
        <p>{{ plan.unit_amount/100 }} {{ plan.currency }} / {{ plan.recurring_interval_count }} {{ plan.recurring_interval }}</p>
        <hr>
        <p class="">{{ plan.product.description }}</p>
    </div>


</div>

</template>

<script>
import axios from "axios"

export default {
  name: "SubscriptionsView",
  data() {
    return {
      plans: [],
    }
  },
  methods: {
    subscribe(priceId) {
      axios({
        method: 'post',
        url: 'dss/checkout/',
        data: {
            'priceId': priceId,
        },
        headers: {
            'Authorization': "Token " + this.$store.state.token,
        }
      }).then(response => {
        console.log(response.data);
        window.location.href = response.data.url;
      }).catch(error => {
        console.log(error);
      })
    },
  },
  beforeMount() {
    axios({
      url: "campains/subscriptions/plans/",
      method: "GET",
      headers: {
        Authorization: `Token ${this.$store.state.token}`,
      },
    }).then(response => {
      this.plans = response.data;
      console.log(this.plans);
    }).catch(error => {
      console.log(error);
    })
  },

}
</script>

<style scoped>

.box {
  align-items: center;
  align-content: center;
  margin: 0 auto;
  width: 20%;
  min-width: 200px;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: lightseagreen;
  color: white;
  box-shadow: 0 0 5px #ccc;
}

.box:hover {
  font-weight: bold;
  cursor: pointer;
  scale: 1.1;
}

</style>