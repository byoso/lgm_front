<template>
  <div>
    <h1 class="title">Table '{{ table.name }}'</h1>
  </div>
</template>

<script>
export default {
  name: "TableView",
  data() {
    return {
      table: {name: "no name"},
    }
  },
  beforeMount() {
    this.table = this.$store.state.current_table;
  }
}
</script>

<style>

</style>