<template>
<form class="form">
  <h1 class="title">Change email</h1>


  <label class="label">Enter your new email</label>
  <input type="text" class="input" required v-model="email">


  <div v-if="errors.length">
    <ul>
      <li v-for="error in Object.values(errors[0])" :key="error" style="color: red;">
        {{ error[0] }}
      </li>
    </ul>
  </div>

  <button class="button is-success mt-2" @click="onSubmit">Confirm</button>


</form>

</template>

<script>
import axios from 'axios';
import { toast } from 'bulma-toast';

export default {
  name: "ChangeEmailView",
  data(){
    return {
      email: "",
      errors: []
    }
  },
  methods: {
    onSubmit() {
      axios({
        url: "/auth/email/request_change/",
        method: "POST",
        data: {
          email: this.email,
        },
        headers: {
          Authorization: `Token ${this.$store.state.token}`,
        },
      })
      .then(response => {
        console.log(response.data)
        toast({
          message: "Confirmation email sent for email change",
          type: "is-info",
          dismissible: true,
          pauseOnHover: true,
          position: 'bottom-right',
          duration: 5000,
        });
        this.$router.push({ name: 'account' })
      })
      .catch(error => {
        console.log(error.response.data);
      })
    }
  }
}
</script>

<style>

</style>