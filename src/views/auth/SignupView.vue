<template>


  <form class="form">
    <h1 class="title">Signup</h1>

    <p class="label">Enter your username</p>
    <input type="text" placeholder="username" required v-model="username" class="input">

    <p class="label">Enter your email</p>
    <input type="text" placeholder="email" required v-model="email" class="input">

    <p class="label">Enter your password</p>
    <input type="password" required placeholder="password" v-model="password" class="input">

    <p class="label">Confirm your password</p>
    <input type="password" required placeholder="password" v-model="password2" class="input">
    <br>


    <div class="m-5">
      <p><input type="checkbox" v-model="termsOfService" @change="checkCreateButton"> I accept the <a href="">terms of service</a></p>
      <p><input type="checkbox" v-model="privacyPolicy" @change="checkCreateButton"> I accept the <a href="">privacy policy</a></p>
    </div>



    <div v-if="errors.length">
      <ul>
        <li v-for="error in Object.values(errors[0])" :key="error" style="color: red;">
          {{ error[0] }}
        </li>
      </ul>
    </div>

    <button class="button is-success mt-2" id="createAccountButton" disabled @click="createAccount">Create my account</button>

  </form>


</template>

<script>
import axios from 'axios';
import { toast } from 'bulma-toast';


export default {
  name: 'SignupView',
  components: {
  },
  data() {
    return {
      username: '',
      email: '',
      password: '',
      password2: '',
      termsOfService: false,
      privacyPolicy: false,
      errors: [],
    }
  },
  methods: {
    checkCreateButton() {
      if (this.termsOfService && this.privacyPolicy) {
        document.querySelector('#createAccountButton').disabled = false;
      } else {
        document.querySelector('#createAccountButton').disabled = true;
      }
    },
    checkEntries() {
      if (this.username === '' || this.email === '' || this.password === '' || this.password2 === '') {
        this.errors.push({"credentials": ["All fields must be filled"],});
        return false;
      }
      if (this.password !== this.password2) {
        this.errors.push({"password": ["Passwords don't match"],});
        return false;
      }
      return true;
    },
    createAccount() {
      console.log("create account")
      this.errors = [];
      if (!this.checkEntries()) {
        return;
      }

      axios.post('auth/users/', {
        username: this.username,
        email: this.email,
        password: this.password,
      })
      .then(response => {
        toast({
          message: `Account created, please check your email to confirm your account`,
          type: 'is-success',
          position: 'bottom-right',
          dismissible: true,
          pauseOnHover: true,
          duration: 10000,
        })
        this.$router.push({ name: 'home' })
      })
      .catch(error => {
        console.log(error.response.data)
        this.errors.push(error.response.data);
      })


    }

  },
}
</script>

<style>
.form {
  width: 50%;
  margin: auto;
}

</style>