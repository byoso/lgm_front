<template>
  <div class="sidebar">
    <div class="top-line">
      <span class="campain-title">{{ charLimit(campain.title) }}</span>
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
      <figure v-if="campain.image_url">
        <img :src="campain.image_url" />
      </figure><br>
      <RatingWidget v-if="collection" :collection="collection" @newCollection="$emit('newCollection', $event)"/>

      <span v-if="campain.is_official">
        <OfficialMark :collection="campain"/>
      </span>
      <br>
      <router-link :to="{name: 'table', params: {id: table.id} }" class="button is-small is-secondary m-2">
      {{ charLimit(table.name) }}
      </router-link>
      <h3 class="subtitle">by {{ charLimit(campain.game_master.username) }}</h3>
    </div>

    <div v-if="isGameMaster | isOwner">
      <div @click="showSettings = !showSettings" class="topic">Settings
        <div class="is-pulled-right mr-2">
          <fa v-if="showSettings" icon="angle-down"/>
          <fa v-if="!showSettings" icon="angle-right"/>
        </div>
      </div>
      <div v-if="showSettings" class="m-2">
          <router-link v-if="isGameMaster"
          :to="{name: 'CampainEditView', params: {id: campain.id}}"
          class="m-2 button is-small is-warning">
            Edit campain...
          </router-link>
          <div>
            Campain is ended : <input type="checkbox" v-model="is_ended" @change="endCampain">
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


      <div v-for="pc in campain.pcs" :key="pc.id">
        <div v-if="isGameMaster | !pc.locked">
          <div class="line-hoverable" @click="showPC(pc)">
            <span class="mr-2"
            v-if="isGameMaster"
            @click="togglePcLock(pc)"
            @mouseover="PCModalAvailable = false"
            @mouseleave="PCModalAvailable = true">
              <fa v-if="pc.locked" icon="eye-slash" style="color: red;" />
              <fa v-else icon="eye" style="color: green;" />
            </span>
            <span v-if="pc.name"> {{ charLimit(pc.name) }} </span>
            <span v-if="!pc.name">---  </span>
            <span v-if="pc.user != null" class="is-pulled-right">{{ charLimit(pc.user.username) }}</span>
            <span v-else class="is-pulled-right">---</span>
          </div>
          <div class="sep"></div>
        </div>
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

    <PCModalCreate v-if="showCreatePCModal"
      :campain="campain" :showCreatePCModal="showCreatePCModal"
      :user="user"
      @closeCreatePCModal="toggleCreatePCModal"
      @addPC="addPC"
    />


    <PCModalDisplay v-if="showPCModalDisplaySwitch"
      :showIt="showPCModalDisplaySwitch"
      :pc="pcToDisplay" :user="user"
      :campain="campain"
      @closePCModalDisplay="showPCModalDisplaySwitch = !showPCModalDisplaySwitch"
      @editionModePC="editionModePC($event)"
    />

    <PCModalEdit v-if="showPCModalEditSwitch"
    :showIt="showPCModalEditSwitch"
    :pc="pcToDisplay" :user="user"
    :campain="campain"
    @closeEditPCModal="showPCModalEditSwitch = !showPCModalEditSwitch"
    @updatePC="updatePC($event)"
    @deletePC="deletePC($event)"

    />


  </div>
</template>

<script>
import axios from 'axios';
import { toast } from 'bulma-toast';
import CreateItemModal from './CreateItemModal.vue';
import PCModalCreate from './PCModalCreate.vue';
import PCModalDisplay from './PCModalDisplay.vue';
import PCModalEdit from './PCModalEdit.vue';
import OfficialMark from '../collections/components/OfficialMark.vue';
import RatingWidget from './RatingWidget.vue'

export default {
  name: "CampainTools",
  components: {
    CreateItemModal,
    PCModalCreate,
    PCModalDisplay,
    PCModalEdit,
    OfficialMark,
    RatingWidget,
  },
  props: [
    'user',
    'campain',
    'refreshSpin',
    'maxItemsDisplay',
    'itemsDisplayMode',
    'collection',
  ],
  computed: {
    isGameMaster() {
      return this.user.id === this.campain.game_master.id;
    },
    isOwner() {
      let table = this.$store.state.current_table
      if (table.owners.filter(owner => owner.id === this.user.id).length > 0){
        return true;
      } else {
        return false;
      }
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
      displayMode: null,
      showInfo: true,
      showItemTools: false,
      showPlayers: false,
      showCreateItemModal: false,
      showDisplayItemModal: false,
      showCreatePCModal: false,
      showPCModalDisplaySwitch: false,
      PCModalAvailable: true,
      showPCModalEditSwitch: false,
      pcToDisplay: {},
      showSettings: false,
      filterBy: '--All--',
      sortBy: 'date+',
      searchBy: '',
      is_ended: this.campain.is_ended,
    }
  },
  beforeMount() {
    this.displayMode = this.$store.state.prefs.itemsDisplayMode,
    this.table = this.$store.state.current_table;
    this.maxItems = this.maxItemsDisplay;
    console.log('CapainTools: ')
    console.log('campain: ', this.campain.title)
    console.log("is_official: ", this.campain.is_official)
    console.log('collection: ', this.collection)
  },
  methods: {
    charLimit(text) {
      if (text.length <= 25) {
        return text;
      }
      return text.slice(0, 22) + '...';
    },
    editionModePC(pc) {
      // console.log("PC to edit: ", pc)
      this.showPCModalDisplaySwitch = !this.showPCModalDisplaySwitch;
      this.pcToDisplay = pc;
      this.showPCModalEditSwitch = !this.showPCModalEditSwitch;
    },
    changeDisplayMode() {
      this.$emit('changeDisplayMode', this.displayMode);
    },
    changeMaxItemsDisplay() {
      // console.log("Max items: ", this.maxItems)
      this.$emit('changeMaxItemsDisplay', this.maxItems);
    },
    addItem() {
      this.refreshCampain();
    },
    addPC() {
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
    },
    togglePcLock(pc){
      pc.locked = !pc.locked;
      axios({
        method: 'put',
        url: `/campains/pc/update/`,
        headers: {
          'Authorization': `Token ${this.$store.state.token}`
        },
        data: {
          id: pc.id,
          locked: pc.locked,
        }
      }).then(response => {
        console.log(response)
        this.$emit('updatePC', pc);
      }).catch(error => {
        console.log(error)
      })
    },
    showPC(pc) {
      if (this.PCModalAvailable) {
        this.pcToDisplay = pc;
        this.showPCModalDisplaySwitch = !this.showPCModalDisplaySwitch;
      }
    },
    updatePC(pc) {
      this.$emit('updatePC', pc);
    },
    deletePC(pc_id) {
      this.$emit('deletePC', pc_id);
    },
    endCampain(){
      console.log("End campain: ", this.is_ended)
      axios({
        method: 'put',
        url: `/campains/switch_end_campain/`,
        headers: {
          'Authorization': `Token ${this.$store.state.token}`
        },
        data: {
          campain_id: this.campain.id,
          table_id: this.table.id,
        }
      }).then(response => {
        console.log(response)
        toast({
          message: 'Campain end status changed',
          type: 'is-success',
          position: 'bottom-right',
          dismissible: true,
          pauseOnHover: true,
          duration: 2000,
        });
      }).catch(error => {
        console.log(error)
        toast({
          message: 'Something went wrong, please try again',
          type: 'is-danger',
          position: 'bottom-right',
          dismissible: true,
          pauseOnHover: true,
          duration: 2000,
        });
      })
    },

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
  cursor: pointer;
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