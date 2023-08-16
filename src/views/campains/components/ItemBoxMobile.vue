<template>
<div class="m-1 "  >
  <div class="columns is-mobile ">
    <div class="colunm is-mobile mobile-item-row"  @click="openDetailsModal(item)"
    :class="[item.type, {'is-9': isGameMaster, 'is-12': !isGameMaster}]"
    >
      <span class="item-name">
        {{ charLimit(item.name) }}
      </span>

    </div>
    <div class="column is-3" v-if="isGameMaster">
      <span class="is-pulled-right mr-5"
      v-if="isGameMaster"
      @click="toggleItemLock">
        <fa v-if="locked" icon="eye-slash" style="color: red;" />
        <fa v-else icon="eye" style="color: green;" />
      </span>
    </div>
  </div>
  <span>


  </span>

</div>

</template>

<script>
import axios from 'axios';

export default {
  name: 'ItemBoxMobile',
  props: [
    'item',
    'user',
    'campain',
  ],
  data() {
    return {
      locked: false,
      openDetailsModalSwitch: true,
    }
  },
  beforeMount() {
    this.locked = this.item.locked
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
    openDetailsModal(item) {
      if (this.openDetailsModalSwitch) {
        this.$emit('showModalDisplay', item)
      }
    },
    toggleItemLock() {
      axios({
        method: 'put',
        url: '/campains/items/update/',
        headers: {
          Authorization: `Token ${this.$store.state.token}`
        },
        data: {
          id: this.item.id,
          locked: !this.locked,
        }
      }).then(response => {
        this.$emit('itemUpdated', response.data)
        this.locked = !this.locked
      }).catch(error => {
        console.log(error)
      })

    }}

}
</script>

<style scoped>

.NPC {
  background-color: #ffa76d;
}
.ORGANIZATION {
  background-color: #8a9df3;
}
.EVENT {
  background-color: #ec746c;
}
.LOCATION {
  background-color: #7bc881;
}
.NOTE {
  background-color: #a8dae3;
}
.RECAP {
  background-color: #d096e4;
}
.MISC {
  background-color: #bbbbbb;
}
.MEMO {
  background-color: #f5e570;
}

.mobile-item-row{
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