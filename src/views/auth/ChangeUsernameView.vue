<template>
  <form>
  <h1 class="title">Change Username</h1>
  <label class="label">Enter your new username</label>
  <input type="text" class="input" v-model="username" placeholder="Username" required>

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
  name: "ChangeUsernameView",
  data(){
    return {
      username: "",
      errors: [],
    }
  },
  methods: {
    onSubmit() {
      this.errors = [];
      axios({
        url: "/auth/username/change/",
        method: "POST",
        data: {
          username: this.username,
        },
        headers: {
          Authorization: `Token ${this.$store.state.token}`,
        },
      })
      .then(response => {
        console.log(response.data)
        toast({
          message: "Username changed",
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

</style>