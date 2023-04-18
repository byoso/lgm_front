<template>

<h1 class="title">Login</h1>

<form>

<p>Enter a credential</p>
<input type="text" placeholder="Email or username" required v-model="credential">

<p>Enter your password</p>
<input type="password" required v-model="password">
<br>
<button class="button is-success mt-2">Login</button>
<p class="m-2"><a href="" >I forgot my password</a></p>
<p class="m-2"><a href="">I already have an account, but please send me the confirmation email again</a></p>

</form>


</template>

<script>

export default {
  name: 'LoginView',
  components: {
  },
  data() {
    return {
      credential: '',
      password: '',
    }
  }
}
</script>

<style>

</style>