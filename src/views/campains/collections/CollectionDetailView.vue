<template>
  collection detail view: {{ collection.name }}
</template>

<script>
import axios from 'axios';

export default {
  name: 'CollectionDetailView',
  data(){
    return {
      collection: {},
      id: null,
    }
  },
  beforeMount(){
    this.id = this.$route.params.id
    this.getCollectionDetail()
  },
  methods: {
    getCollectionDetail(){
      axios({
        method: 'get',
        url: `/campains/collection/`,
        headers: {
          'Authorization': `Token ${this.$store.state.token}`
        },
        params: {
          id: this.id,
        }
      })
      .then(response => {
        this.collection = response.data
        console.log(this.collection)
      })
      .catch(error => {
        console.log(error);
      });
    },

  },

}
</script>

<style>

</style>