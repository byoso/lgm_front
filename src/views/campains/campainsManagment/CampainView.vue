<template>
<div>
  <!-- mobile interface -->
  <div class="is-hidden-tablet" id="mobile-menu">
    <div class="tabs-bar-mobile">
      <div class="tabs is-centered">
          <a class="button is-small button-mobile is-active" @click="displayMobile('items')" id="tab-items">Items</a>
          <a class="button is-small button-mobile" @click="displayMobile('pcs')" id="tab-pcs">PCs</a>
          <a class="button is-small button-mobile" @click="displayMobile('infos')" id="tab-infos">Infos</a>
          <a class="button is-small button-mobile" @click="displayMobile('settings')" id="tab-settings">
            <fa icon="gear" />
          </a>
          <button class="button is-small is-success" :disabled="refreshSpin" @click="refresh_campain">
            <fa icon="arrows-rotate" :class="{'spinner': refreshSpin}"/>
          </button>
      </div>

    </div>

    <div v-if="displayMobileItems">
      <div class="columns  is-mobile">
        <div class="column is-5">
          <div class="select is-small">
            <select v-model="filterBy" @change="filterItems(filterBy)">
              <option selected>--All--</option>
              <option v-for="type in itemTypes" :key="type">{{ type }}</option>
            </select>
          </div>
        </div>
        <div class="column is-4">
          <div class="select is-small">
            <select v-model="sortBy" @click="sortItems(sortBy)">
              <option value="name">name</option>
              <option value="date+">date +</option>
              <option value="date-">date -</option>
              <option value="type">type</option>
            </select>
          </div>
        </div>
        <div class="column is-3">
          <button class="button is-small is-success" @click="showCreateItemModal=true">
            + Item
          </button>
        </div>
      </div>

      <ItemBoxMobile v-for="item in shownItems" :key="item.id"
      :item="item" :user="user" :campain="campain"
      @itemUpdated="getUpdatedItem($event)"
      @showModalDisplay="showItemModalDisplay($event)"
      />
    </div>

    <div v-if="displayMobilePcs">
      <button v-if="isGameMaster & displayMobilePcs" class="button is-success is-small mb-4"
      @click="showCreatePCModal=true">
        + PC
      </button>

      <PcBoxMobile v-for="pc in campain.pcs" :key="pc.id"
      :pc="pc" :user="user" :campain="campain"
      @updatePC="updatePC($event)"
      @deletePC="deletePC($event)"
      />
    </div>

    <div v-if="displayMobileInfos">
      {{ campain.title }}

      <figure v-if="campain.image_url">
        <img :src="campain.image_url" />
      </figure><br>
      <RatingWidget v-if="collection" :collection="collection" @newCollection="$emit('newCollection', $event)"/>

      <span v-if="campain.is_official">
        <OfficialMark :collection="campain"/>
      </span>
      <div class="m-2">
        <router-link :to="{name: 'table', params: {id: table.id} }" class="button is-small is-secondary mr-2">
        {{ charLimit(table.name) }}
        </router-link>
        <span class="subtitle">Mastered by {{ charLimit(campain.game_master.username) }}</span>
      </div>
    </div>

    <div v-if="displayMobileSettings">
      <router-link v-if="isGameMaster"
      :to="{name: 'CampainEditView', params: {id: campain.id}}"
      class="m-2 button is-small is-warning">
        Edit campain...
      </router-link>
      <div v-if="isGameMaster | isOwner">
        Campain is ended : <input type="checkbox" v-model="campain.is_ended" @change="endCampain">
      </div>
      <hr>
      <div>
        <label class="label">Max items displayed</label>
        <div class="select">
          <select class="is-small" v-model="maxItems" @change="changeMaxItemsDisplay(maxItems)">
            <option value="all">--All--</option>
            <option value=10>10</option>
            <option value=30>30</option>
            <option value=50 selected>50</option>
            <option value=100>100</option>
          </select>
        </div>
      </div>
    </div>

    <div>
      <button onclick="window.scrollTo({top: 0, behavior: 'smooth'});"
      class="button is-small" style="position: fixed; bottom: 10px; right: 10px;"
      >
        scroll top
      </button>
    </div>

  </div>

  <!-- desktop interface -->
  <div class="columns is-hidden-mobile">
    <div class="main-window">
    </div>
      <div class="column is-9 items-window">
        <br>
        <div class="columns is-multiline m-2">
          <ItemBox v-for="item in shownItems" :key="item.id"
          :item="item" :user="user" :campain="campain"
          :displayMode="itemsDisplayMode"
          @itemUpdated="getUpdatedItem($event)"
          @showModalDisplay="showItemModalDisplay($event)"
          />
        </div>

      </div>
      <div class="column is-3 ">
        <CampainTools class="campain-tools"
        :campain="$store.state.current_campain" :user="$store.state.user"
        :refreshSpin="refreshSpin"
        :maxItemsDisplay="maxItemsDisplay"
        :itemsDisplayMode="itemsDisplayMode"
        :collection="collection"
        @refreshCampain="refresh_campain()"
        @changeMaxItemsDisplay="changeMaxItemsDisplay($event)"
        @changeDisplayMode="changeDisplayMode($event)"
        @filterItems="filterItems($event)"
        @sortItems="sortItems($event)"
        @searchItems="searchItems($event)"
        @resetSearch="resetSearch()"
        @updatePC="updatePC($event)"
        @deletePC="deletePC($event)"
        @newCollection="newCollection($event)"

        />

      </div>
  </div>

  <!-- modals -->

  <ItemModalDisplay
    v-if="showItemModalDisplaySwitch"
    :item="itemToDisplay" :user="user"
    :campain="campain"
    :showIt="showItemModalDisplaySwitch"
    @showModalDisplay="showItemModalDisplay($event)"
    @editionMode="showItemModalEditOn($event)"
  />

  <ItemModalEdit
    v-if="showItemModalEditSwitch"
    :item="itemToDisplay" :user="user"
    :campain="campain"
    :showIt="showItemModalEditSwitch"
    @showModalEdit="showItemModalEditOff($event)"
    @itemUpdated="getUpdatedItem($event)"
    @itemDeleted="itemDeleted($event)"
  />

  <!-- Mobile modals -->
  <CreateItemModal v-if="showCreateItemModal"
    :campain="campain" :showCreateItemModal="showCreateItemModal"
    :user="user"
    @closeCreateItemModal="showCreateItemModal=false"
    @addItem="refresh_campain"
  />

  <PCModalCreate v-if="showCreatePCModal"
    :campain="campain" :showCreatePCModal="showCreatePCModal"
    :user="user"
    @closeCreatePCModal="showCreatePCModal=false"
    @addPC="refresh_campain"
  />

  <PCModalEdit v-if="showPCModalEditSwitch"
  :showIt="showPCModalEditSwitch"
  :pc="pcToDisplay" :user="user"
  :campain="campain"
  @closeEditPCModal="showPCModalEditSwitch=false"
  @updatePC="updatePC($event)"
  @deletePC="deletePC($event)"

  />


</div>
</template>

<script>
import axios from 'axios';
import { toast } from 'bulma-toast';

import CampainTools from '../components/CampainTools.vue';
import ItemBox from '../components/ItemBox.vue';
import ItemBoxMobile from '../components/ItemBoxMobile.vue';
import PcBoxMobile from '../components/PcBoxMobile.vue';
import ItemModalDisplay from '../components/ItemModalDisplay.vue';
import ItemModalEdit from '../components/ItemModalEdit.vue';
import CreateItemModal from '../components/CreateItemModal.vue';
import PCModalCreate from '../components/PCModalCreate.vue';
import PCModalDisplay from '../components/PCModalDisplay.vue';
import PCModalEdit from '../components/PCModalEdit.vue';
import OfficialMark from '../collections/components/OfficialMark.vue';
import RatingWidget from '../components/RatingWidget.vue'

export default {
  name: 'CampainView',
  components: {
    CampainTools,
    ItemBox,
    ItemModalDisplay,
    ItemModalEdit,
    ItemBoxMobile,
    CreateItemModal,
    PCModalCreate,
    PCModalEdit,
    PcBoxMobile,
    OfficialMark,
    RatingWidget,


  },
  data() {
    return {
      user: {},
      campain: {title: "no title"},
      collection: {},
      table: {},
      refreshSpin: false,
      itemsDisplayMode: 'image', // mini or image
      shownItems: [],
      maxItemsDisplay: 50,
      showItemModalDisplaySwitch: false,
      showItemModalEditSwitch: false,
      itemToDisplay: {},
      filterBy: '--All--',
      sortBy: 'date+', // date- date+ name type
      searchBy: '',

      // mobile interface only
      displayMobileItems: true,
      displayMobilePcs: false,
      displayMobileInfos: false,
      displayMobileSettings: false,
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
      // mobile interface modals
      showCreateItemModal: false,
      showCreatePCModal: false,
      showPCModalDisplaySwitch: false,
      showPCModalEditSwitch: false,
      maxItems: 50,
      }
  },
  computed: {
    isGameMaster() {
      return this.user.id === this.campain.game_master.id;
    },
  },
  beforeMount() {
    this.itemsDisplayMode = this.$store.state.prefs.itemsDisplayMode;
    this.user = this.$store.state.user;
    this.campain = this.$store.state.current_campain;
    this.collection = this.campain.parent_collection
    this.refresh_campain()
  },
  methods: {
    charLimit(text) {
      if (text.length <= 25) {
        return text;
      }
      return text.slice(0, 22) + '...';
    },
    displayMobile(value){
      let elemItems = document.getElementById("tab-items")
      let elemPcs = document.getElementById("tab-pcs")
      let elemInfos = document.getElementById("tab-infos")
      let elemSettings = document.getElementById("tab-settings")

      if (value == 'items') {
        this.displayMobileItems = true;
        this.displayMobilePcs = false;
        this.displayMobileInfos = false;
        this.displayMobileSettings = false;
        elemItems.classList.add("is-active");
        elemPcs.classList.remove("is-active");
        elemInfos.classList.remove("is-active");
        elemSettings.classList.remove("is-active");
      } else if (value == 'pcs') {
        this.displayMobileItems = false;
        this.displayMobilePcs = true;
        this.displayMobileInfos = false;
        this.displayMobileSettings = false;
        elemItems.classList.remove("is-active");
        elemPcs.classList.add("is-active");
        elemInfos.classList.remove("is-active");
        elemSettings.classList.remove("is-active");
      } else if (value == 'infos') {
        this.displayMobileItems = false;
        this.displayMobilePcs = false;
        this.displayMobileInfos = true;
        this.displayMobileSettings = false;
        elemItems.classList.remove("is-active");
        elemPcs.classList.remove("is-active");
        elemInfos.classList.add("is-active");
        elemSettings.classList.remove("is-active");
      } else if (value == 'settings') {
        this.displayMobileItems = false;
        this.displayMobilePcs = false;
        this.displayMobileInfos = false;
        this.displayMobileSettings = true;
        elemItems.classList.remove("is-active");
        elemPcs.classList.remove("is-active");
        elemInfos.classList.remove("is-active");
        elemSettings.classList.add("is-active");
      }

    },
    newCollection(collection){
      this.refresh_campain()
    },
    itemDeleted(id) {
      this.showItemModalDisplaySwitch = false;
      this.showItemModalEditSwitch = false;
      let item = this.campain.items.find(item => item.id == id);
      let index = this.campain.items.indexOf(item)
      if (index !== -1) {
        this.campain.items.splice(index, 1);
      }
    },
    searchItems(value){
      this.searchBy = value;
      if (value == '') {
        this.shownItems = this.campain.items;
        this.filterItems(this.filterBy);
      } else {
        this.shownItems = this.campain.items.filter(item => item.name.toLowerCase().includes(value.toLowerCase()));
      }
    },
    filterItems(value){
      this.filterBy = value;
      if (value == '--All--') {
        this.shownItems = this.campain.items;
      } else {
        this.shownItems = this.campain.items.filter(item => item.type == value);
      }

      this.sortItems(this.sortBy);
    },
    sortItems(value){
      this.shownItems = this.shownItems.sort((a, b) => {
        if (value == 'date-') {
          return new Date(a.date_unlocked) - new Date(b.date_unlocked);
        } else if (value == 'date+') {
          return new Date(b.date_unlocked) - new Date(a.date_unlocked);
        } else if (value == 'name') {
          return a.name.localeCompare(b.name);
        } else if (value == 'type') {
          return a.type.localeCompare(b.type);
        }
      });
    },
    showItemModalEditOn(item) {
      this.showItemModalDisplaySwitch = false;
      this.showItemModalEditSwitch = true;
      this.itemToDisplay = item;
    },
    showItemModalEditOff(item) {
      this.showItemModalDisplaySwitch = true;
      this.showItemModalEditSwitch = false;
      this.itemToDisplay = item;
    },
    showItemModalDisplay(item) {
      this.showItemModalDisplaySwitch = !this.showItemModalDisplaySwitch;
      this.itemToDisplay = item;
    },
    getUpdatedItem(response_item){
      let item = this.campain.items.find(item => item.id == response_item.id);
      let index = this.campain.items.indexOf(item)
      if (index !== -1) {
        this.campain.items.splice(index, 1, response_item);
      }

      let storedItem = this.$store.state.current_campain.items.find(item => item.id == response_item.id);
      let storedIndex = this.$store.state.current_campain.items.indexOf(item)
      if (index !== -1) {
        this.$store.state.current_campain.items.splice(index, 1, response_item);
      }


    },
    changeDisplayMode(value){
      this.$store.state.prefs.itemsDisplayMode = value;
      this.itemsDisplayMode = value;
    },
    changeMaxItemsDisplay(value){
      this.maxItemsDisplay = value;
      if (this.maxItemsDisplay === "all") {
        this.shownItems = this.campain.items;

      }else{
        this.shownItems = this.campain.items.slice(0, this.maxItemsDisplay);
      }
    },
    refresh_campain() {
      this.user = this.$store.state.user;
      this.campain = this.$store.state.current_campain;
      this.table = this.$store.state.current_table;
      this.refreshSpin = true;
      axios({
        method: 'get',
        url: `/campains/campains/${this.campain.id}/`,
        headers: {
          'Authorization': `Token ${this.$store.state.token}`
        }
      })
      .then(response => {
        this.collection = response.data.collection;
        this.campain = response.data.campain;
        if (!this.isGameMaster) {
          this.campain.items = this.campain.items.filter(item => !item.locked);
        }
        this.shownItems = this.campain.items;
        this.table = response.data.campain.table;
        this.$store.state.current_campain = response.data.campain;
        this.$store.state.current_table = response.data.campain.table;
        this.refreshSpin = false;
        this.filterItems(this.filterBy);
      })
      .catch(error => {
        console.log(error)
        this.refreshSpin = false;
      })
    },
    updatePC(pc){
      let old_pc = this.campain.pcs.find(item => item.id == pc.id);
      let index = this.campain.pcs.indexOf(old_pc)
      if (index !== -1) {
        this.campain.pcs.splice(index, 1, pc);
      }
    },
    deletePC(pc_id){
      let old_pc = this.campain.pcs.find(item => item.id == pc_id);
      let index = this.campain.pcs.indexOf(old_pc)
      if (index !== -1) {
        this.campain.pcs.splice(index, 1);
      }
    },
    endCampain(){
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
.campain-tools {
  margin-top: -50px;
  padding: 10px;
  height: 90vh;
  overflow-y: auto;
  overflow-x: hidden;
}

.items-window {
  margin-top: -70px;
}

.button-mobile.is-active {
  background-color: rgb(90, 220, 214);
}

.select {
  margin-bottom: 10px;
}

.tabs-bar-mobile {
  width: 100%;
  padding: 10px;
  margin-top: -50px;
  margin-left: -5px;
}

</style>