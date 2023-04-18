<template>

<h1 class="title">Signup</h1>

<form class="controle">

<p>Enter your username</p>
<input type="text" placeholder="username" required>

<p>Enter your email</p>
<input type="text" placeholder="email" required>

<p>Enter your password</p>
<input type="password" required placeholder="password">

<p>Confirm your password</p>
<input type="password" required placeholder="password">
<br>


<div class="m-5">
  <p><input type="checkbox"> I accept the <a href="">terms of service</a></p>
  <p><input type="checkbox"> I accept the <a href="">privacy policy</a></p>
</div>



<button class="button is-success mt-2">Create my account</button>

</form>


</template>

<script>

export default {
  name: 'SignupView',
  components: {
  },
  data() {
    return {
      username: '',
      email: '',
      password: '',
      password2: ''
    }
  }
}
</script>

<style>

</style>