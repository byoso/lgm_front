<template>
  <div class="container">


    <h1 class="title">Collections</h1>


    <button class="button is-primary is-small m-2" @click="collectionCreate">+ New Collection</button>
    <router-link class="button is-secondary is-small m-2" :to="{ name: 'exchangesView' }">Open exchanges interface</router-link>


    <div @click="showMyCollections = !showMyCollections" class="topic">My Collections
      <div class="is-pulled-right mr-2">
        <fa v-if="showMyCollections" icon="angle-down"/>
        <fa v-if="!showMyCollections" icon="angle-right"/>
      </div>
    </div>

    <div v-if="showMyCollections">
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
              <td class="table-name">{{ collection.name.slice(0, 25) }}</td>
              <td>{{ collection.game.slice(0, 25) }}</td>
              <td>{{ formatDate(collection.date_updated) }}</td>
            </tr>
          </tbody>

        </table>
      </div>
    </div>


    <div @click="showFavorites = !showFavorites" class="topic">My Favorite Collections
      <div class="is-pulled-right mr-2">
        <fa v-if="showFavorites" icon="angle-down"/>
        <fa v-if="!showFavorites" icon="angle-right"/>
      </div>
    </div>

    <!-- favorites -->

    <div v-if="showFavorites">
      <div v-if="favorites.length">
        <table class="table is-fullwidth">
          <thead>
            <tr>
              <th>name</th>
              <th>game</th>
              <th>rating</th>
              <th>actions</th>
              <th>author</th>
              <th>language</th>
              <th>last updated</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="collection in favorites" :key="collection.id">
              <td class="table-name">
                  {{ collection.name.slice(0, 25) }}
              </td>
              <td>
                <OfficialMark v-if="collection.is_official" :collection="collection"/>
                {{ collection.game.slice(0, 25) }}
              </td>
              <td>{{ collection.rating }}</td>
              <td>
                  <ActionsButton
                  :collection="collection"
                  :tables="tables"
                  @favoritesAction="favoritesAction($event)"
                  />
              </td>
              <td>{{ collection.author.slice(0, 25) }}</td>
              <td>{{ collection.language }}</td>
              <td>{{ formatDate(collection.date_updated) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else>
        you don't have favorites yet.

      </div>
    </div>


    <!-- shared collections -->

    <div @click="showSharedCollections = !showSharedCollections" class="topic">
      Browse Shared Collections <span v-if="!$store.state.user.is_subscriber"> (Subscribers only)</span>
      <div v-if="$store.state.user.is_subscriber" class="is-pulled-right mr-2">
        <fa v-if="showSharedCollections" icon="angle-down"/>
        <fa v-if="!showSharedCollections" icon="angle-right"/>
      </div>
    </div>

    <div v-if="showSharedCollections & $store.state.user.is_subscriber">

      <div class="search-form">
        <label class="label m-2">Only officials</label>
        <input type="checkbox" class="checkbox" v-model="only_officials">
        <label for="" class="label m-2 ml-5">Language</label>
        <select v-model="language" class="m-2 is-small">
          <option value="all">--All--</option>
          <option value="ar">Arabic</option>
          <option value="cs">Czech</option>
          <option value="zh">Chinese</option>
          <option value="da">Danish</option>
          <option value="nl">Dutch</option>
          <option value="en">English</option>
          <option value="fi">Finnish</option>
          <option value="fr">French</option>
          <option value="de">German</option>
          <option value="el">Greek</option>
          <option value="hi">Hindi</option>
          <option value="hu">Hungarian</option>
          <option value="it">Italian</option>
          <option value="ja">Japanese</option>
          <option value="ko">Korean</option>
          <option value="no">Norwegian</option>
          <option value="fa">Persian</option>
          <option value="pl">Polish</option>
          <option value="pt">Portuguese</option>
          <option value="ru">Russian</option>
          <option value="es">Spanish</option>
          <option value="sv">Swedish</option>
          <option value="th">Thai</option>
          <option value="tr">Turkish</option>
          <option value="vi">Vietnamese</option>

        </select>
      </div>
      <div class="search-form">
        <span class="label m-1">by</span>
        <div class="select m-1 is-small">
          <select v-model="searchBy">
            <option value="game">Game</option>
            <option value="name">Collection Name</option>
            <option value="author">Author</option>
          </select>
        </div>
        <input class="input m-1 is-small" type="text" placeholder="Your search..." v-model="searchText">
        <button class="button is-primary m-1 is-small" @click="searchSharedCollections">Go</button>
      </div>

      <!-- pagination -->

      <span>Collections found: {{ sharedCount }}</span>

      <div v-if="sharedPages > 1" class="my-pagination">
        <button @click="getSharedPage('previous')"
          :disabled="sharedPage == 1"
          class="mr-5 button is-small is-rounded">&#60&#60
        </button>
        <div>Page {{sharedPage}}/{{ sharedPages }}</div>
        <button @click="getSharedPage('next')"
          :disabled="sharedPages == sharedPage"
          class="ml-5 button is-small is-rounded"
          >&#62&#62
        </button>
      </div>

      <!-- shared collections -->

      <div v-if="sharedCollections.length">
        <table class="table is-fullwidth">
          <thead>
            <tr>
              <th>name</th>
              <th>game</th>
              <th>rating</th>
              <th>actions</th>
              <th>author</th>
              <th>language</th>
              <th>last updated</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="collection in sharedCollections" :key="collection.id">
              <td class="table-name">
                  {{ collection.name.slice(0, 25) }}
              </td>
              <td>
                <OfficialMark v-if="collection.is_official" :collection="collection"/>
                {{ collection.game.slice(0, 25) }}
              </td>
              <td>{{ collection.rating }}</td>
              <td>
                  <ActionsButton
                  :collection="collection"
                  :tables="tables"
                  @favoritesAction="favoritesAction($event)"
                  />
              </td>
              <td>{{ collection.author.slice(0, 20) }}</td>
              <td>{{ collection.language }}</td>
              <td>{{ formatDate(collection.date_updated) }}</td>
            </tr>
          </tbody>

        </table>
      </div>

    </div>

  </div>
</template>

<script>
import axios from 'axios'
import OfficialMark from './components/OfficialMark.vue'
import ActionsButton from './components/ActionsButton.vue'

export default {
  name: 'CollectionsView',
  components: {
    OfficialMark,
    ActionsButton,
  },
  data(){
    return {
      tables: [],
      searchBy: 'game',
      searchText: '',
      language: 'en',
      only_officials: false,
      showMyCollections: true,
      showFavorites: false,
      showSharedCollections: false,
      myCollections: [],
      favorites: [],
      sharedCollections: [],
      // pagination
      sharedNext: null,
      sharedPrevious: null,
      sharedCount: 0,
      sharedPages: 0,
      sharedPage: 0,
    }
  },
  beforeMount(){
    this.getMyCollectionList()
    this.getFavoritesList()
  },
  methods: {
    getFavoritesList() {
      axios({
        method: 'get',
        url: "campains/favorite_collection/",
        headers: {
          'Authorization': `Token ${this.$store.state.token}`
        },
      }).then(response => {
        console.log("Response: ", response.data)
        this.favorites = response.data
      }).catch(error => {
        console.log(error);
      })
    },
    favoritesAction(collection) {
      if (this.favorites.filter(item => item.id == collection.id).length) {
        this.removeFromFavorites(collection)
      } else {
        this.addToFavorites(collection)
      }
    },
    removeFromFavorites(collection) {
      axios({
        method: 'delete',
        url: "campains/favorite_collection/",
        headers: {
          'Authorization': `Token ${this.$store.state.token}`
        },
        data: {
          'collection_id': collection.id,
        }
      }).then(response => {
        console.log("Response: ", response.data)
        this.favorites = this.favorites.filter(item => item.id != collection.id)
      }).catch(error => {
        console.log(error);
      })
    },
    addToFavorites(collection) {
      axios({
        method: 'post',
        url: "campains/favorite_collection/",
        headers: {
          'Authorization': `Token ${this.$store.state.token}`
        },
        data: {
          'collection_id': collection.id,
        }
      }).then(response => {
        console.log("Response: ", response.data)
        this.favorites = this.favorites.filter(item => item.id != collection.id)
        this.favorites.unshift(collection)
      }).catch(error => {
        console.log(error);
      });
    },
    getSharedPage(action){
      let url = ''
      if (action === 'next') {
        url = this.sharedNext
      } else if (action === 'previous'){
        url = this.sharedPrevious
      }
      axios({
        method: 'get',
        url: url,
        headers: {
          'Authorization': `Token ${this.$store.state.token}`
        },
      }).then(response => {
        this.sharedCollections = response.data.results
        this.sharedNext = response.data.pagination.next
        this.sharedPrevious = response.data.pagination.previous
        this.sharedCount = response.data.pagination.total
        this.sharedPages = response.data.pagination.pages
        this.sharedPage = response.data.pagination.page
        console.log("Response: ", response.data)
      }).catch(error => {
        console.log(error);
      });

    },
    searchSharedCollections(){
      this.sharedCollections = []
      axios({
        method: 'get',
        url: "campains/shared_collections/",
        headers: {
          'Authorization': `Token ${this.$store.state.token}`
        },
        params: {
          'search_by': this.searchBy,
          'search_text': this.searchText,
          'language': this.language,
          'only_officials': this.only_officials,
        }
      })
      .then(response => {
        this.sharedCollections = response.data.results
        this.sharedNext = response.data.pagination.next
        this.sharedPrevious = response.data.pagination.previous
        this.sharedCount = response.data.pagination.total
        this.sharedPages = response.data.pagination.pages
        this.sharedPage = response.data.pagination.page
        console.log("Response: ", response.data)
      })
      .catch(error => {
        console.log(error);
      });
    },
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
        this.myCollections = response.data.collections
        this.tables = response.data.tables
        console.log("initial datas get: ", response.data)
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
        this.myCollections.unshift(response.data)
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
.search-form {
  display: flex;
  margin-bottom: 5px;
  margin-top: 5px;
}

.table-name{
  font-weight: bold;
  color: gray;
}

.my-pagination{
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
  margin-bottom: 10px;
}
</style>
