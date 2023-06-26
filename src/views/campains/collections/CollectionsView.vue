<template>
  <div class="container">


    <h1 class="title">Collections</h1>


    <button class="button is-primary is-small m-2" @click="collectionCreate">+ New Collection</button>
    <button class="button is-secondary is-small m-2" @click="">Open exchange interface</button>

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
              <td class="table-name">{{ collection.name }}</td>
              <td>{{ collection.game }}</td>
              <td>{{ formatDate(collection.date_updated) }}</td>
            </tr>
          </tbody>

        </table>
      </div>
    </div>

    <div @click="showSharedCollections = !showSharedCollections" class="topic">
      Shared Collections <span v-if="!$store.state.user.is_subscriber"> (Subscribers only)</span>
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
      <div v-if="sharedCollections.length">
        <table class="table is-fullwidth">
          <thead>
            <tr>
              <th>name</th>
              <th>game</th>
              <th>actions</th>
              <th>author</th>
              <th>language</th>
              <th>last updated</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="collection in sharedCollections" :key="collection.id">
              <td class="table-name">
                  {{ collection.name }}
              </td>
              <td>
                <OfficialMark v-if="collection.is_official" :collection="collection"/>
                {{ collection.game }}
              </td>
              <td>
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
                      <a href="" class="dropdown-item">
                        Use as new campain
                      </a>
                      <a href="" class="dropdown-item">
                        Exchange Interface
                      </a>
                      <a href="" class="dropdown-item">
                        <span>
                          <fa icon="heart" style="color: red;"/>
                          add to favorites
                        </span>

                      </a>
                    </div>
                  </div>

                </div>
              </td>
              <td>{{ collection.author }}</td>
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

export default {
  name: 'CollectionsView',
  components: {
    OfficialMark,
  },
  data(){
    return {
      searchBy: 'game',
      searchText: '',
      language: 'en',
      only_officials: false,
      showMyCollections: true,
      showSharedCollections: false,
      myCollections: [],
      sharedCollections: [],
    }
  },
  beforeMount(){
    this.getMyCollectionList()
  },
  methods: {
    searchSharedCollections(){
      this.sharedCollections = []
      axios({
        method: 'get',
        url: "campains/get_shared_collections/",
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
        this.sharedCollections = response.data
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
</style>
