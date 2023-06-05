<template>
  <div class="sidebar">
    <div class="top-line">
      <span class="campain-title">{{ campain.title }} </span>
      <button class="button is-success is-small mb-2" :disabled="refreshSpin" @click="refreshCampain">
        <fa icon="arrows-rotate" class="mr-2" :class="{'spinner': refreshSpin}"/>
      refresh
      </button>
    </div>

    <div @click="showInfo = !showInfo" class="topic">Campain infos
      <div class="is-pulled-right mr-2">
        <fa v-if="showInfo" icon="angle-down"/>
        <fa v-if="!showInfo" icon="angle-right"/>
      </div>
    </div>
    <div v-if="showInfo">
      <p>
        <p>
          <figure v-if="campain.image_url">
            <img :src="campain.image_url" />
          </figure>
        </p>

        <router-link :to="{name: 'table', params: {id: table.id} }">
        {{ table.name }}
        </router-link>
        <h3 class="subtitle">by {{ campain.game_master.username }}</h3>
      </p>
    </div>

    <div v-if="isGameMaster">
      <div @click="showSettings = !showSettings" class="topic">Settings
        <div class="is-pulled-right mr-2">
          <fa v-if="showSettings" icon="angle-down"/>
          <fa v-if="!showSettings" icon="angle-right"/>
        </div>
      </div>
      <div v-if="showSettings" >
        <div class="m-2">
          <router-link :to="{name: 'CampainEditView', params: {id: campain.id}}" class="m-2 button is-small is-warning">Edit campain...</router-link>
          <label class="label">Danger zone</label>
          <button class="button is-warning is-small"
          @click="allowDeleteCampain = !allowDeleteCampain">
          delete campain
          </button>
          <button  :disabled="!allowDeleteCampain"
          @click.prevent="deleteCampain(campain.id)"
          class="button is-danger is-small">Confirm deletion
          </button>
        </div>
      </div>

    </div>

    <div @click="showPlayers = !showPlayers" class="topic">Player Characters
      <div class="is-pulled-right mr-2">
        <fa v-if="showPlayers" icon="angle-down"/>
        <fa v-if="!showPlayers" icon="angle-right"/>
      </div>
    </div>
    <div v-if="showPlayers">
      <button v-if="isGameMaster" class="button is-small is-success m-2" @click="toggleCreatePCModal">+ New PC</button>
      <div v-for="player in campain.campain_pcs" :key="player.id" class="line-hoverable">
        {{ player.user.username }}
        <span class="is-pulled-right">{{ player.character_name }}
          <span v-if="player.user.id === campain.game_master.user.id">(GM)</span>
        </span>

      <div class="sep"></div>
      </div>
    </div>

    <div @click="showItemTools = !showItemTools" class="topic">
      <div class="is-pulled-right mr-2">
        <fa v-if="showItemTools" icon="angle-down"/>
        <fa v-if="!showItemTools" icon="angle-right"/>
      </div>
      Item tools
    </div>
    <div v-if="showItemTools">
      <button class="button is-small is-success m-2" @click="toggleCreateItemModal">+ New Item</button>
      <label class="label">Search</label>
      <div class="field">
        <div class="control button-in-input">
          <input class="input is-small" type="text" placeholder="Search by name" v-model="searchBy"
          @keyup.enter="searchBy='';$emit('searchItems', searchBy)"
          @keyup="$emit('searchItems', searchBy)"
          />
          <button @click="searchBy='';$emit('searchItems', searchBy)">reset</button>
        </div>

      </div>
      <label class="label">Filters</label>
      <div class="select">
        <select class="is-small" v-model="filterBy" @change="$emit('filterItems', filterBy)">
          <option>--All--</option>
          <option v-for="type in itemTypes" :key="type">{{ type }}</option>
        </select>
      </div>
      <div class="select">
        <select class="is-small" v-model="sortBy" @click="$emit('sortItems', sortBy)">
          <option value="name">name</option>
          <option value="date+">date +</option>
          <option value="date-">date -</option>
          <option value="type">type</option>
        </select>
      </div>
      <label class="label">Items display</label>
      <div class="field">
        <div class="control">
          <label class="radio">
            <input type="radio" name="Settings" value="mini" v-model="displayMode" @change="changeDisplayMode">
            Minimal
          </label>
          <label class="radio">
            <input type="radio" name="Settings" value="image" v-model="displayMode" @change="changeDisplayMode">
            With Images
          </label>
        </div>
      </div>
      <label class="label">Max items</label>
      <div class="select">
        <select class="is-small" v-model="maxItems" @change="changeMaxItemsDisplay">
          <option value="all">--All--</option>
          <option value=10>10</option>
          <option value=30>30</option>
          <option value=50>50</option>
          <option value=100>100</option>
        </select>
      </div>
    </div>

    <CreateItemModal v-if="showCreateItemModal"
    :campain="campain" :showCreateItemModal="showCreateItemModal"
    :user="user"
    @closeCreateItemModal="toggleCreateItemModal"
    @addItem="addItem"
    />

  </div>
</template>

<script>
import axios from 'axios';
import CreateItemModal from './CreateItemModal.vue';

export default {
  name: "CampainTools",
  components: {
    CreateItemModal,
  },
  props: [
    'user',
    'campain',
    'refreshSpin',
    'maxItemsDisplay',
    'itemsDisplayMode',
  ],
  computed: {
    isGameMaster() {
      return this.user.id === this.campain.game_master.id;
    },
  },
  data() {
    return {
      table: {},
      itemTypes: [
        'NPC',
        'LOCATION',
        'ORGANIZATION',
        'EVENT',
        'NOTE',
        'RECAP',
        'MISC',
        'MEMO',
      ],
      typeSelected: '--All--',
      sortBySelected: 'date',
      maxItems: null,
      displayMode: 'mini',
      showInfo: true,
      showItemTools: false,
      showPlayers: false,
      showCreateItemModal: false,
      showDisplayItemModal: false,
      showCreatePCModal: false,
      showSettings: false,
      allowDeleteCampain: false,
      filterBy: '--All--',
      sortBy: 'date+',
      searchBy: '',
    }
  },
  beforeMount() {
    this.table = this.$store.state.current_table;
    this.maxItems = this.maxItemsDisplay;
    console.log("user is ", this.user)
  },
  methods: {
    changeDisplayMode() {
      this.$emit('changeDisplayMode', this.displayMode);
    },
    changeMaxItemsDisplay() {
      console.log("Max items: ", this.maxItems)
      this.$emit('changeMaxItemsDisplay', this.maxItems);
    },
    addItem() {
      this.refreshCampain();
    },
    refreshCampain() {
      this.$emit('refreshCampain');
    },
    toggleCreateItemModal(){
      this.showCreateItemModal = !this.showCreateItemModal;
    },
    toggleCreatePCModal(){
      this.showCreatePCModal = !this.showCreatePCModal;
      console.log("TODO: display create PC modal")
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

<style scoped>
.sidebar {
  position: sticky;
  top: 60px;
}
img {
  height: 256px;
  width: auto;
}
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
.modal {
  overflow: auto;
}
.delete {
  background-color: rgb(200, 50, 50);
}

.sep {
  border-bottom: 1px solid rgb(106, 227, 221);
}
.line-hoverable {
  user-select: none;
}
.line-hoverable:hover {
  background-color: rgb(130, 234, 229);
  color: rgb(92, 92, 92);
}

.top-line {
  display: flex;
  justify-content: space-between;
}

.refresh {
  background-color: blue;
}
.spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.button-in-input {
  display: flex;
}

</style>