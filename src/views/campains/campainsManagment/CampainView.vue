<template>
<div>
  <!-- mobile interface -->
  <div class="is-hidden-tablet">
    <div class="tabs is-centered">
        <a class="button is-small button-mobile is-active" @click="displayMobile('items')" id="tab-items">Items</a>
        <a class="button is-small button-mobile" @click="displayMobile('pcs')" id="tab-pcs">PCs</a>
        <a class="button is-small button-mobile" @click="displayMobile('infos')" id="tab-infos">Infos</a>
        <a class="button is-small button-mobile" @click="displayMobile('settings')" id="tab-settings">Settings</a>
        <button class="button is-small is-success" :disabled="refreshSpin" @click="refresh_campain">
          <fa icon="arrows-rotate" :class="{'spinner': refreshSpin}"/>
        </button>
    </div>
    <div v-if="displayMobileItems">
      <div>
        <select class="select is-fullwidth" v-model="filterBy" @change="filterItems(filterBy)">
          <option selected>--All--</option>
          <option v-for="type in itemTypes" :key="type">{{ type }}</option>
        </select>
      </div>

      <ItemBoxMobile v-for="item in shownItems" :key="item.id"
      :item="item" :user="user" :campain="campain"
      @itemUpdated="getUpdatedItem($event)"
      @showModalDisplay="showItemModalDisplay($event)"
      />
    </div>
    <div v-if="displayMobilePcs">
      <table>
        <tbody>
          <tr v-for="pc in campain.pcs" :key="pc.id">
            <td>{{ pc.name }}</td>

          </tr>
        </tbody>
      </table>
    </div>
    <div v-if="displayMobileInfos">
      Infos
    </div>
    <div v-if="displayMobileSettings">
      Settings
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


</div>
</template>

<script>
import axios from 'axios';
import CampainTools from '../components/CampainTools.vue';
import ItemBox from '../components/ItemBox.vue';
import ItemBoxMobile from '../components/ItemBoxMobile.vue';
import ItemModalDisplay from '../components/ItemModalDisplay.vue';
import ItemModalEdit from '../components/ItemModalEdit.vue';

export default {
  name: 'CampainView',
  components: {
    CampainTools,
    ItemBox,
    ItemModalDisplay,
    ItemModalEdit,
    ItemBoxMobile,

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
    console.log('campainView mounted, collection: ', this.collection)
    this.refresh_campain()
  },
  methods: {
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

      console.log("displayMobile: ", value)
    },
    newCollection(collection){
      this.refresh_campain()
    },
    itemDeleted(id) {
      console.log("item deleted: ", id)
      this.showItemModalDisplaySwitch = false;
      this.showItemModalEditSwitch = false;
      let item = this.campain.items.find(item => item.id == id);
      console.log("item to delete: ", item)
      console.log('index in campain: ', this.campain.items.indexOf(item))
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
      console.log("sort by: ", value)
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
      console.log("show item edit: \n", item)
      this.showItemModalDisplaySwitch = false;
      this.showItemModalEditSwitch = true;
      this.itemToDisplay = item;
    },
    showItemModalEditOff(item) {
      console.log("hide item edit: \n", item)
      this.showItemModalDisplaySwitch = true;
      this.showItemModalEditSwitch = false;
      this.itemToDisplay = item;
    },
    showItemModalDisplay(item) {
      console.log("show item details: \n", item)
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
      console.log("this.$store.state.prefs.itemsDisplayMode: ", this.$store.state.prefs.itemsDisplayMode)
      this.itemsDisplayMode = value;
    },
    changeMaxItemsDisplay(value){
      console.log("changeMaxItemsDisplay in vue: ", value)
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
      console.log("shownItems: ", this.shownItems)
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
        console.log('collection (axios response): ', this.collection)
        this.campain = response.data.campain;
        if (!this.isGameMaster) {
          this.campain.items = this.campain.items.filter(item => !item.locked);
        }
        this.shownItems = this.campain.items;
        this.table = response.data.campain.table;
        this.$store.state.current_campain = response.data.campain;
        this.$store.state.current_table = response.data.campain.table;
        console.log(this.campain.title)
        this.refreshSpin = false;
        this.filterItems(this.filterBy);
        console.log("refreshed campain: \n", this.campain)
        console.log("refreshed collection: \n", this.collection)
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
      console.log("delete pc: ", pc_id)
      let old_pc = this.campain.pcs.find(item => item.id == pc_id);
      let index = this.campain.pcs.indexOf(old_pc)
      if (index !== -1) {
        this.campain.pcs.splice(index, 1);
      }

    }
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

.tabs {
  margin-top: -40px;
  position: sticky;
}

.button-mobile.is-active {
  background-color: rgb(90, 220, 214);
}
</style>