<template>

  <div class="dropdown is-hoverable">
    <div class="dropdown-trigger">
      <button class="button is-small" aria-haspopup="true" aria-controls="dropdown-menu3">
        <span>actions</span>
        <span class="icon is-small">
          <i class="fas fa-angle-down" aria-hidden="true"></i>
          <fa icon="angle-down"/>
        </span>
      </button>
    </div>
    <div class="dropdown-menu" id="dropdown-menu3" role="menu">
      <div class="dropdown-content">
        <a class="dropdown-item" @click="showModal=!showModal">
          Use as new campain
        </a>
        <a class="dropdown-item">
          Exchange Interface
        </a>
        <a class="dropdown-item" @click="$emit('favoritesAction', collection)">
          <span>
            <fa icon="heart" style="color: red;"/>
            add/remove favorite
          </span>

        </a>
      </div>
    </div>


    <div class="modal" :class="{'is-active': showModal}">
      <div class="modal-background" @click="showModal=!showModal"></div>
      <div class="modal-content">
        <h1 class="subtitle">
          Choose a table to create the new campain
        </h1>
        <div class="buttons">
          <button
          v-for="table in tables"
          :key="table.id"
          class="button is-small"
          @click="createCampainFromCollection(table)"
          >
            {{ table.name }}
          </button>
        </div>
      </div>
      <button class="modal-close is-large" aria-label="close" @click="showModal=!showModal"></button>
    </div>





  </div>
</template>

<script>
import axios from 'axios'
import { toast } from 'bulma-toast'

export default {
  name: 'ActionsButton',
  props: [
    'collection',
    'tables',
  ],
  data() {
    return {
      showModal: false,
    }
  },
  methods: {
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
        console.log(response)
        toast({
          message: `Campain created successfully for table ${table.name}`,
          position: 'bottom-right',
          type: 'is-success',
          dismissible: true,
          pauseOnHover: true,
          duration: 5000,
        })
        this.showModal = false
      }).catch((error) => {
        console.log(error)
      })
    },
  },
}
</script>

<style scoped>
.modal-content {
  background-color: #fff;
  padding: 1rem;
  border-radius: 0.5rem;
}

</style>