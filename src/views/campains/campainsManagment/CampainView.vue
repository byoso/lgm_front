<template>
  <h1>CampainView {{ campain.title }}</h1>
  {{ campain }}
</template>

<script>
export default {
  name: 'CampainView',
  data() {
    return {
      campain: {title: "no title"},
      table: {},
      }
  },
  beforeMount() {
    this.campain = this.$store.current_campain;
    this.table = this.$store.current_table;
  },

}
</script>

<style>

</style>