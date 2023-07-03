<template>

  <div class="modal" :class="{'is-active': showIt}">
    <div class="modal-background" @click="$emit('showModalDisplay', item)"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <span class="modal-card-title">{{ charLimit(item.name) }}</span>
        <span class="item-type">{{ item.type }}</span>
        <span v-if="isGameMaster | item.type === 'MEMO'" class="button is-small is-success mr-2"
        @click="editionMode(item)">
          Edit
        </span>
        <button class="delete" aria-label="close" @click="$emit('showModalDisplay', item)"></button>
      </header>
      <section class="modal-card-body">
        <div class="content" id="data_pc">
          {{ dataPC }}
        </div>
        <hr v-if="isGameMaster">
        <div v-if="isGameMaster" class="content" id="data_gm">
          {{ dataGM }}
        </div>
        <div v-if="item.image_url" >
          <hr>
          <img :src="item.image_url" alt="[image]" class="item-image">
        </div>

      </section>
      <footer class="modal-card-foot">
      </footer>
    </div>
  </div>


</template>

<script>
export default {
  name: 'ItemModalDisplay',
  props: [
    'item',
    'user',
    'campain',
    'showIt',
  ],
  data() {
    return {
      dataPC: '',
      dataGM: '',
    }
  },
  mounted() {
    let elem_pc = document.getElementById('data_pc')
    elem_pc.innerHTML = this.dataPC
    if (this.isGameMaster) {
      let elem_gm = document.getElementById('data_gm')
      elem_gm.innerHTML = this.dataGM
    }
  },
  computed:{
    isGameMaster() {
      return this.user.id === this.campain.game_master.id
    },
    dataPC() {
      return marked.parse(this.item.data_pc)
    },
    dataGM() {
      if (this.isGameMaster) {
        return marked.parse(this.item.data_gm)
      }else {
        return ''
      }
    },
  },
  data() {
    return {
    }
  },
  methods: {
    charLimit(text) {
      if (text.length <= 25) {
        return text;
      }
      return text.slice(0, 22) + '...';
    },
    editionMode(item) {
      this.$emit('showModalDisplay', item)
      this.$emit('editionMode', item)
    },
  },

}
</script>

<style scoped>

.item-image {
  width: 512px;
  height: 512px;
  object-fit: contain;
  margin-left: auto;
  margin-right: auto;
}

.item-type {
  margin-right: 15px;
  font-size: 0.8em;
  font-weight: bold;
  color: #999;
}


</style>