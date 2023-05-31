<template>
<div>
  <div class="columns">
    <div class="main-window">
    </div>
      <div class="column is-9">
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
        :campain="campain" :refreshSpin="refreshSpin"
        :maxItemsDisplay="maxItemsDisplay"
        :itemsDisplayMode="itemsDisplayMode"
        @refreshCampain="refresh_campain()"
        @changeMaxItemsDisplay="changeMaxItemsDisplay($event)"
        @changeDisplayMode="changeDisplayMode($event)"
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
  />

</div>
</template>

<script>
import axios from 'axios';
import CampainTools from '../components/CampainTools.vue';
import ItemBox from '../components/ItemBox.vue';
import ItemModalDisplay from '../components/ItemModalDisplay.vue';
import ItemModalEdit from '../components/ItemModalEdit.vue';

export default {
  name: 'CampainView',
  components: {
    CampainTools,
    ItemBox,
    ItemModalDisplay,
    ItemModalEdit,

  },
  data() {
    return {
      user: {},
      campain: {title: "no title"},
      table: {},
      refreshSpin: false,
      itemsDisplayMode: 'mini',
      shownItems: [],
      maxItemsDisplay: 50,
      showItemModalDisplaySwitch: false,
      showItemModalEditSwitch: false,
      itemToDisplay: {},
      }
  },
  beforeMount() {
    this.refresh_campain();
  },
  methods: {
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
      // this.campain = this.$store.state.current_campain;

      // let shownItem = this.shownItems.find(item => item.id === response_item.id)[0];


    },
    changeDisplayMode(value){
      console.log("changeDisplayMode in vue: ", value)
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
      this.user = this.$store.user;
      this.campain = this.$store.current_campain;
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
        this.campain = response.data;
        this.shownItems = this.campain.items;
        this.table = response.data.table;
        this.$store.state.current_campain = response.data;
        this.$store.state.current_table = response.data.table;
        console.log(this.campain.title)
        this.refreshSpin = false;
      })
      .catch(error => {
        console.log(error)
        this.refreshSpin = false;
      })
    },
  }

}
</script>

<style>
.campain-tools {
  margin-top: 20px;
  padding: 10px;
  height: 90vh;
  overflow-y: auto;
  overflow-x: hidden;
}

body {
  margin-top: -30px;
}

</style>