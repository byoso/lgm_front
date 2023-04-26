<template>
<p class="guest">
  <span><input type="text" class="input" :value="email" placeholder="Enter the guest's email"></span>

</p>


</template>

<script>
export default {
  name: "Guest",
  data() {
    return {
      email: String,
    }
  },
  methods: {
  }
}
</script>

<style>

</style>