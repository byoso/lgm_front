<template>

<form class="form">
  <h1 class="title">Change Password</h1>

  <label class="label">Enter your new password</label>
  <input type="password" class="input" v-model="password" required placeholder="Password">


  <label class="label">Confirm your new password</label>
  <input type="password" class="input" v-model="password2" required placeholder="Password">



  <div v-if="errors.length">
    <ul>
      <li v-for="error in Object.values(errors[0])" :key="error" style="color: red;">
        {{ error[0] }}
      </li>
    </ul>
  </div>

  <button class="button is-success mt-2" @click="onSubmit">Change password</button>


</form>


</template>

<script>
import axios from 'axios';
import { toast } from 'bulma-toast';

export default {
  name: "ChangePasswordView",
  data() {
    return {
    password: "",
    password2: "",
    errors: [],

    }
  },
  methods: {
    onSubmit() {
      this.errors = [];
      axios({
        url: "/auth/password/change/",
        method: "POST",
        data: {
          password: this.password,
          password2: this.password2,
        },
        headers: {
          Authorization: `Token ${this.$store.state.token}`,
        },
      })
      .then(response => {
        console.log(response.data)
        toast({
          message: "Password changed",
          type: "is-success",
          dismissible: true,
          pauseOnHover: true,
          position: 'bottom-right',
          duration: 5000,
        });
        this.$router.push({ name: 'account' })
      })
      .catch(error => {
        this.errors.push(error.response.data);
        console.log(error.response.data);
      })
    }
  }

}
</script>

<style>

.form {
  width: 50%;
  margin: auto;
}
</style>