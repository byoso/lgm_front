<template>
<div class="m-1 "  >
  <div class="columns is-mobile ">
    <div class="colunm is-mobile mobile-pc-row"  @click="showPC(pc)"
    :class="{'is-9': isGameMaster, 'is-12': !isGameMaster}"
    >
      <p class="item-name">
        {{ charLimit(pc.name) }}
      </p>
      <p v-if="pc.user" class="is-pulled-right">
        {{ charLimit(pc.user.username)}}
      </p>

    </div>
    <div class="column is-3" v-if="isGameMaster">
      <span class="is-pulled-right mr-5"
      v-if="isGameMaster"
      @click="togglePcLock(pc)">
        <fa v-if="pc.locked" icon="eye-slash" style="color: red;" />
        <fa v-else icon="eye" style="color: green;" />
      </span>
    </div>
  </div>
  <span>


  </span>

    <!-- modals -->

  <PCModalDisplay v-if="showPCModalDisplaySwitch"
    :showIt="showPCModalDisplaySwitch"
    :pc="pcToDisplay" :user="user"
    :campain="campain"
    @closePCModalDisplay="showPCModalDisplaySwitch=false"
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
import PCModalCreate from './PCModalCreate.vue';
import PCModalDisplay from './PCModalDisplay.vue';
import PCModalEdit from './PCModalEdit.vue';

export default {
  name: 'PcBoxMobile',
  components: {
    PCModalCreate,
    PCModalDisplay,
    PCModalEdit,
  },
  props: [
    'pc',
    'user',
    'campain',
  ],
  data() {
    return {
      locked: false,
      showPCModalDisplaySwitch: false,
      showPCModalEditSwitch: false,
    }
  },
  beforeMount() {
    this.locked = this.pc.locked
  },
  computed: {
    isGameMaster() {
      return this.user.id === this.campain.game_master.id
    },
  },
  methods: {
    charLimit(text) {
      if (text.length <= 25) {
        return text;
      }
      return text.slice(0, 22) + '...';
    },
    showPC(pc) {
      console.log("show pc modal")
      this.pcToDisplay = pc;
      this.showPCModalDisplaySwitch = !this.showPCModalDisplaySwitch;
    },
    editionModePC(pc) {
      // console.log("PC to edit: ", pc)
      this.showPCModalDisplaySwitch = !this.showPCModalDisplaySwitch;
      this.pcToDisplay = pc;
      this.showPCModalEditSwitch = !this.showPCModalEditSwitch;
    },
    updatePC(pc) {
      this.$emit('updatePC', pc);
    },
    deletePC(pc_id) {
      this.$emit('deletePC', pc_id);
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
    }
  },
}
</script>

<style scoped>

.mobile-pc-row{
  background-color: white;
  border: 1px solid black;
  border-radius: 5px;
  min-height: 48px;
  width: 100%;
  margin: 5px;
  padding: 5px;
}
.mobile-colmun {
  width: 100%;

}

.item-name {
  overflow: hidden;
  font-weight: bold;
}
</style>