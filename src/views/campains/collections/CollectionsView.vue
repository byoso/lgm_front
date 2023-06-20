<template>
  <div class="container">
    <h1 class="title">Collections</h1>

    <div @click="showMyCollections = !showMyCollections" class="topic">My Collections
      <div class="is-pulled-right mr-2">
        <fa v-if="showMyCollections" icon="angle-down"/>
        <fa v-if="!showMyCollections" icon="angle-right"/>
      </div>
    </div>

    <div v-if="showMyCollections">
      <button class="button is-success is-small m-2" @click="collectionCreate">+ New Collection</button>
      <div v-if="myCollections.length">
        <table class="table is-fullwidth">
          <thead>
            <tr>
              <th>name</th>
              <th>game</th>
              <th>last updated</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="collection in myCollections" class="hoverable" :key="collection.id"
            @click="viewCollectionDetail(collection.id)">
              <td>{{ collection.name }}</td>
              <td>{{ collection.game }}</td>
              <td>{{ formatDate(collection.date_updated) }}</td>
            </tr>
          </tbody>

        </table>
      </div>
    </div>

    <div @click="showSharedCollections = !showSharedCollections" class="topic">Shared Collections
      <div class="is-pulled-right mr-2">
        <fa v-if="showSharedCollections" icon="angle-down"/>
        <fa v-if="!showSharedCollections" icon="angle-right"/>
      </div>
    </div>

    <div v-if="showSharedCollections">
      collection shared
    </div>

  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'CollectionsView',
  data(){
    return {
      showMyCollections: true,
      showSharedCollections: false,
      myCollections: [],
    }
  },
  beforeMount(){
    this.getMyCollectionList()
  },
  methods: {
    viewCollectionDetail(id){
      this.$router.push({name: 'collectionDetailView', params: {id: id}})
    },
    formatDate(dateString) {
      const date = new Date(dateString);
          // Then specify how you want your dates to be formatted
      return new Intl.DateTimeFormat('default', {dateStyle: 'long'}).format(date);
    },
    getMyCollectionList(){
      axios({
        method: 'get',
        url: "campains/collections_crud/",
        headers: {
          'Authorization': `Token ${this.$store.state.token}`
        },
      })
      .then(response => {
        this.myCollections = response.data
        console.log(this.myCollections)
      })
      .catch(error => {
        console.log(error);
      });
    },
    collectionCreate(){
      axios({
        method: 'post',
        url: "campains/collections_crud/",
        headers: {
          'Authorization': `Token ${this.$store.state.token}`
        },
      })
      .then(response => {
        console.log(response.data);
        this.myCollections.push(response.data)
      })
      .catch(error => {
        console.log(error);
      });
    }
  }

}
</script>

<style scoped>

.topic {
  background-color: lightseagreen;
  color: white;
  cursor: pointer;
  border: 1px solid rgb(106, 227, 221);
  border-radius: 5px;
}
.topic:hover {
  background-color: rgb(130, 234, 229);
  color: rgb(92, 92, 92);
}

.hoverable:hover {
  background-color: rgb(176, 255, 210);
  color: rgb(92, 92, 92);
  cursor: pointer;
}
</style>
