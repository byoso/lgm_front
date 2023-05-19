<template>
<div>
  <h1>CampainView {{ campain.title }}</h1>

  <figure class="image is-128x128 is-pulled-right">
    <img v-if="campain.game.image_url" :src="campain.game.image_url">
    <img v-else src="https://bulma.io/images/placeholders/128x128.png">
  </figure>

  {{ campain }}
  <br>
  <button @click.prevent="deleteCampain(campain.id)" class="button is-danger">Delete '{{ campain.title }}'</button>

</div>
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
    this.table = this.$store.state.current_table;
  },
  methods: {
    deleteCampain(id) {
      // this.$router.push({name: 'TableView', params: {id: this.table.id}});
      console.log(this.$store.state.current_table)
      console.log(this.$store.state.current_campain)
      console.log("TODO delete: ", this.campain.id)
    }
  }

}
</script>

<style>

</style>