<template>

    <div class="modal" :class="{'is-active': show}">
      <div class="modal-background" @click="show=!show"></div>
      <div class="modal-content">
        <h1 class="subtitle">
          Choose a table to create the new campaign
        </h1>
        <div class="buttons">
          <button
          v-for="table in tables"
          :key="table.id"
          class="button is-small"
          @click="createCampainFromCollection(table)"
          >
            {{ charLimit(table.name) }}
          </button>
        </div>
      </div>
      <button class="modal-close is-large" aria-label="close" @click="show=!show"></button>
    </div>

</template>

<script>
import axios from 'axios';
import { toast } from 'bulma-toast';

export default {
  name: 'TablesModal',
  props: [
    'tables',
    'collection',
    'show',
  ],
  methods: {
    charLimit(text) {
      if (text.length <= 25) {
        return text;
      }
      return text.slice(0, 22) + '...';
    },
    createCampainFromCollection(table) {
      axios({
        method: 'post',
        url: '/campains/create_campain_from_collection/',
        headers: {
          'Authorization': `Token ${this.$store.state.token}`
        },
        data: {
          collection_id: this.collection.id,
          table_id: table.id,
        },
      }).then((response) => {
        toast({
          message: `Campain created successfully for table ${table.name}`,
          position: 'bottom-right',
          type: 'is-success',
          dismissible: true,
          pauseOnHover: true,
          duration: 5000,
        })
        this.$emit('closeTablesModal')
      }).catch((error) => {
        console.log(error)
      })
    },
  }
}
</script>

<style scoped>

.modal-content {
  background-color: #fff;
  padding: 1rem;
  border-radius: 0.5rem;
}

</style>