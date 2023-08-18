<template>
<div class="container">
  <h1 class="title">Subscriptions</h1>

    <div class="legal mb-4">
      <p>
        <strong class="mr-4">
          I accept the
          <a href="privacyPolicy.html" target="_blank">Privacy Policy</a>
        </strong>
        <input type="checkbox" v-model="acceptPolicy">
      </p>
      <p>
        <strong class="mr-4">
          I accept the
          <a href="TandC.html" target="_blank">Terms and Conditions</a>
        </strong>
        <input type="checkbox" v-model="acceptTC">
      </p>
      <p>
        <strong class="mr-4">
          I am 18+
        </strong>
        <input type="checkbox" v-model="accept18">
      </p>
    </div>

    <div v-for="plan in plans" @click="subscribe(plan.id)" :key="plan.id"
    :class="{'box': termsAccepted, 'box-disabled': !termsAccepted}"

    >
        <h2 class="subtitle" style="color: white;">{{ plan.product.name }}</h2>
        <hr>
        <p>{{ plan.unit_amount/100 }} {{ plan.currency }} / {{ plan.recurring_interval_count }} {{ plan.recurring_interval }}</p>
        <hr>
        <p class="">{{ plan.product.description }}</p>
        <hr>
        Get acces to all features suitable for Game Masters.
        <br>
        <ul>
          <li>- Create new campains</li>
          <li>- Create new items collections</li>
          <li>- Use the shared collections for your own campains</li>
        </ul>
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
      acceptPolicy: false,
      acceptTC: false,
      accept18: false,
    }
  },
  computed: {
    termsAccepted() {
      return this.acceptPolicy && this.acceptTC && this.accept18;
    }
  },
  methods: {
    subscribe(priceId) {
      if (!this.termsAccepted){
        return;
      }
      axios({
        method: 'post',
        url: 'campains/subscriptions/checkout/',
        data: {
            'priceId': priceId,
        },
        headers: {
            'Authorization': "Token " + this.$store.state.token,
        }
      }).then(response => {
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
  min-width: 400px;
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
  transition: all 0.1s ease-in-out;
}

.box-disabled {
  align-items: center;
  align-content: center;
  margin: 0 auto;
  width: 20%;
  min-width: 400px;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: rgb(175, 175, 175);
  color: rgb(61, 61, 61);
  box-shadow: 0 0 5px #ccc;
}

.legal {
  align-items: center;
  align-content: center;
  margin: 0 auto;
  margin-bottom: 10px;
  width: 20%;
  min-width: 400px;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: white;
  color: white;
  box-shadow: 0 0 5px #ccc;
}
</style>