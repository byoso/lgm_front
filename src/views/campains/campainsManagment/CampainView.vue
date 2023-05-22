<template>
<div>
  <h1 class="title">{{ campain.title }}</h1>
  <h2 class="subtitle"><router-link :to="{name: 'table', params: {id: table.id} }" @click="gotoTable(table)">{{ table.name }}</router-link></h2>

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
import axios from 'axios';


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
    gotoTable(){
      this.$router.push({name: 'table', params: {id: this.table.id}});
    },
    deleteCampain(id) {
      axios({
        method: 'delete',
        url: `/campains/campains/${this.campain.id}/`,
        headers: {
          'Authorization': `Token ${this.$store.state.token}`
        }
      })
      .then(response => {
        console.log(response)
        this.$router.push({name: 'table', params: {id: this.table.id}});
      })
      .catch(error => {
        console.log(error)
      })
    }
  }

}
</script>

<style>

</style>