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
          <figure>
            <a v-if="campain.game.image_url" :href="campain.game.official_site" target="_blank">
              <img :src="campain.game.image_url">
            </a>
            <img v-else src="https://bulma.io/images/placeholders/128x128.png">
          </figure>

        </p>

        <router-link :to="{name: 'table', params: {id: table.id} }">
        {{ table.name }}
        </router-link>
        <h3 class="subtitle">by {{ campain.game_master.character_name }}</h3>
      </p>
    </div>

    <div @click="showSettings = !showSettings" class="topic">Settings
      <div class="is-pulled-right mr-2">
        <fa v-if="showSettings" icon="angle-down"/>
        <fa v-if="!showSettings" icon="angle-right"/>
      </div>
    </div>
    <div v-if="showSettings" >
      <label class="label">Items display</label>
      <div class="field">
        <div class="control">
          <label class="radio">
            <input type="radio" name="Settings" value="cards" v-model="itemsDisplay">
            Cards
          </label>
          <label class="radio">
            <input type="radio" name="Settings" value="rows" v-model="itemsDisplay">
            Rows
          </label>
        </div>
      </div>
      <label class="label">Max items</label>
      <div class="select">
        <select class="is-small" v-model="maxItems" @change="changeMaxItemsDisplay">
          <option value=10>10</option>
          <option value=30>30</option>
          <option value=50>50</option>
          <option value=100>100</option>
        </select>
      </div>
      <div v-if="user.id === campain.game_master.user.id" class="m-2">
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

    <div @click="showPlayers = !showPlayers" class="topic">Players
      <div class="is-pulled-right mr-2">
        <fa v-if="showPlayers" icon="angle-down"/>
        <fa v-if="!showPlayers" icon="angle-right"/>
      </div>
    </div>
    <div v-if="showPlayers">
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
        <div class="control">
          <input class="input is-small" type="text" placeholder="Search by name">
        </div>
      </div>
      <label class="label">Filters</label>
      <div class="select">
        <select class="is-small">
          <option>--All--</option>
          <option v-for="type in itemTypes" :key="type">{{ type }}</option>
        </select>
      </div>
      <div class="select">
        <select class="is-small">
          <option value="name">name</option>
          <option value="date+">date +</option>
          <option value="date-">date -</option>
          <option value="type">type</option>
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
    'campain',
    'refreshSpin',
    'maxItemsDisplay',
  ],
  data() {
    return {
      table: {},
      user: {},
      itemTypes: [
        'NPC',
        'PLACE',
        'ORGANIZATION',
        'EVENT',
        'NOTE',
        'RECAP',
      ],
      typeSelected: '--All--',
      sortBySelected: 'date',
      itemsDisplay: 'cards',
      maxItems: null,
      showInfo: true,
      showItemTools: false,
      showPlayers: false,
      showCreateItemModal: false,
      showSettings: false,
      allowDeleteCampain: false,
    }
  },
  beforeMount() {
    this.table = this.$store.state.current_table;
    this.maxItems = this.maxItemsDisplay;
    this.user = this.$store.user;
    console.log("user is ", this.user)
  },
  methods: {
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

</style>