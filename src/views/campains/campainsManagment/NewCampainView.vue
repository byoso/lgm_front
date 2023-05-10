<template>
<div>
  <h1 class="title">Start a New Campain</h1>
  <h2 class="subtitle"> {{ table.name }} </h2>

</div>


</template>

<script>
export default {
  name: "NewCampainView",
  data() {
    return {
      table: {},
    }
  },
  beforeMount() {
    this.table = this.$store.state.current_table
  }

}
</script>

<style>

</style>