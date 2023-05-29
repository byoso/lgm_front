<template>

<div class="card is-3 item-box m-2" :class="item.type">
  <div class="card-content">
    <div class="item-title">
      {{ item.name }}
      <div class="is-pulled-right is-pulled-top button is-small is-rounded" v-if="user.id === campain.game_master.user.id">
        <fa v-if="item.locked" icon="eye-slash" style="color: red;" />
        <fa v-else icon="eye" style="color: green;" />
      </div>
    </div>
    <div class="is-centered">
      <img v-if="item.image_url" :src="item.image_url" alt="item.title" class="item-image">

    </div>


    <div class="content">
      <br>

    </div>
  </div>
</div>

</template>

<script>
export default {
  name: 'ItemBox',
  props: [
    'item',
    'user',
    'campain',

  ],
  data() {
    return {
      }
  },

}
</script>

<style scoped>
.item-box {
  border: 1px solid black;
  border-radius: 5px;
  width: 256px;
  min-height: 96px;
}


.item-box:hover {
  border: 1px solid lightseagreen;
  cursor: pointer;
  transform: scale(1.05);
  transition: all 0.1s ease-in-out;
}

.NPC {
  background-color: #f9b88a;
}
.ORGANIZATION {
  background-color: #688eee;
}
.EVENT {
  background-color: #ff7f62;
}
.PLACE {
  background-color: #70ff7c;
}
.NOTE {
  background-color: #9cf0ff;
}
.RECAP {
  background-color: #e9a6ff;
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

</style>