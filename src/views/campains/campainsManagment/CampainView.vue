<template>
<div>
  <div class="columns">
    <div class="column is-9">
      <br>
      <div class="columns is-multiline m-2">

        <ItemBox v-for="item in shownItems" :key="item.id"
        :item="item" :user="user" :campain="campain" :showIt="showItemModalDisplaySwitch"
        :displayMode="itemsDisplayMode"
        @itemUpdated="getUpdatedItem($event)"
        @showModalDisplay="showItemModalDisplay($event)"
        />

      </div>

    </div>

    <div class="column is-3">
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
</div>
</template>

<script>
import axios from 'axios';
import CampainTools from '../components/CampainTools.vue';
import ItemBox from '../components/ItemBox.vue';
import ItemModalDisplay from '../components/ItemModalDisplay.vue';

export default {
  name: 'CampainView',
  components: {
    CampainTools,
    ItemBox,
    ItemModalDisplay,

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
      }
  },
  beforeMount() {
    this.refresh_campain();
  },
  methods: {
    showItemModalDisplay(item) {
      console.log("show: ", item.name)
      this.showItemModalDisplaySwitch = !this.showItemModalDisplaySwitch;
    },
    getUpdatedItem(res_item){
      this.$store.state.current_campain.items.find(item => item.id == res_item.id)[0] = res_item;
      this.campain = this.$store.state.current_campain;
      let item = this.shownItems.find(item => item.id == res_item.id)[0];
      item = res_item;

      console.log(res_item)
    },
    changeDisplayMode(value){
      console.log("changeDisplayMode in vue: ", value)
      this.itemsDisplayMode = value;
    },
    changeMaxItemsDisplay(value){
      console.log("changeMaxItemsDisplay in vue: ", value)
      this.maxItemsDisplay = value;
      this.shownItems = this.campain.items.slice(0, this.maxItemsDisplay);
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
  padding: 10px;
  height: 90vh;
  overflow-y: auto;
  overflow-x: hidden;
}

</style>