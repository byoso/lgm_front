<template>
  <div>
    <h1 class="title">Table '{{ table.name }}'</h1>

    <a class="button is-success" v-if="is_owner" @click="newCampain">+ new campain</a>
  </div>
</template>

<script>
export default {
  name: "TableView",
  data() {
    return {
      table: {name: "no name"},
      is_owner: false,
    }
  },
  beforeMount() {
    this.table = this.$store.state.current_table;
    console.log(this.table)
    if (this.table.owners.some(e => e.id === this.$store.user.id) & this.$store.user.is_subscriber) {
      this.is_owner = true;
    }
  },
  methods: {
    newCampain() {
      this.$router.push({name: 'NewCampainView'});
    }
  }
}
</script>

<style>

</style>
