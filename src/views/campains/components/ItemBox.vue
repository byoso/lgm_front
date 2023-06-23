<template>

<div class="card is-3 item-box m-2" :class="item.type" @click="openDetailsModal(item)">
  <div class="card-content p-1">
    <div class="item-title is-size-6">
        <div class="is-pulled-right button is-small is-rounded tooltip"
        v-if="isGameMaster"
        @click="toggleItemLock"
        @mouseover="openDetailsModalSwitch = false"
        @mouseleave="openDetailsModalSwitch = true">
          <span class="tooltiptext">Visibility for the players</span>
          <fa v-if="locked" icon="eye-slash" style="color: red;" />
          <fa v-else icon="eye" style="color: green;" />
        </div>
      {{ item.name }}

    </div>
    <div v-if="displayMode === 'image'" class="is-centered">
      <img v-if="item.image_url" :src="item.image_url" alt="[image]" class="item-image">

    </div>


    <div class="content">
      <br>

    </div>
  </div>
</div>

</template>

<script>
import axios from 'axios';

export default {
  name: 'ItemBox',
  props: [
    'item',
    'user',
    'campain',
    'displayMode',

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

    }
  }

}
</script>

<style scoped>
.item-box {
  border: 1px solid black;
  border-radius: 5px;
  width: 240px;
  min-height: 96px;
}

.item-box:hover {
  border: 1px solid lightseagreen;
  cursor: pointer;
  transform: scale(1.05);
  transition: all 0.1s ease-in-out;
}

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

.item-image {
  width: 128px;
  height: 128px;
  object-fit: contain;
}

.is-centered {
  margin-left: auto;
  margin-right: auto;
  text-align: center;
}

.item-title {
  font-size: 1.5em;
  color: rgb(65, 65, 65);
  font-weight: bold;
  text-align: center;
}

/* Tooltip container */
.tooltip {
  position: relative;
  display: inline-block;
}

/* Tooltip text */
.tooltip .tooltiptext {
  visibility: hidden;
  background-color: rgb(65, 65, 65);
  color: #e1e1e1;
  text-align: center;
  padding: 2px;
  margin-top: -30px;
  margin-left: -100px;
  border-radius: 6px;

  /* Position the tooltip text - see examples below! */
  position: absolute;
  z-index: 1;
}

/* Show the tooltip text when you mouse over the tooltip container */
.tooltip:hover .tooltiptext {
  visibility: visible;
}

</style>