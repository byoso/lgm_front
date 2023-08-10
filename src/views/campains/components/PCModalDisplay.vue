<template>

  <div class="modal mt-6" :class="{'is-active': showIt}">
    <div class="modal-background" @click="$emit('closePCModalDisplay', pc)"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <span class="modal-card-title">{{ charLimit(pc.name) }}</span>
        <span v-if="isGameMaster | isPlayer" class="button is-small is-success mr-2"
        @click="editionMode">
          Edit
        </span>
        <button class="delete" aria-label="close" @click="$emit('closePCModalDisplay', pc)"></button>
      </header>
      <section class="modal-card-body">

        <div class="content" id="data_pc" v-html=dataPC>
        </div>

        <hr v-if="isGameMaster | isPlayer">
        <div v-if="isGameMaster | isPlayer" class="content" id="data_player" v-html=dataPlayer>
        </div>

        <hr v-if="isGameMaster">
        <div v-if="isGameMaster" class="content" id="data_gm" v-html=dataGM>
        </div>

        <div v-if="pc.image_url" >
          <hr>
          <img :src="pc.image_url" alt="[image]" class="item-image">
        </div>

      </section>
      <footer class="modal-card-foot">
      </footer>
    </div>
  </div>


</template>

<script>
export default {
  name: 'PCModalDisplay',
  props: [
    'pc',
    'user',
    'campain',
    'showIt',
  ],
  mounted(){
    let p_elems = document.getElementsByTagName('p')
    for (let i = 0; i < p_elems.length; i++) {
      p_elems[i].style.wordBreak = 'keep-all'
    }
  },
  computed:{
    isGameMaster() {
      return this.user.id === this.campain.game_master.id
    },
    isPlayer() {
      if (this.pc.user === null) {
        return false
      }else {
        return this.user.id === this.pc.user.id
      }
    },
    dataPC() {
      return marked.parse(this.pc.data_pc)
    },
    dataPlayer() {
      if (this.isPlayer | this.isGameMaster) {
        return marked.parse(this.pc.data_player)
      }else {
        return ''
      }
    },
    dataGM() {
      if (this.isGameMaster) {
        return marked.parse(this.pc.data_gm)
      }else {
        return ''
      }
    },
  },
  methods: {
    charLimit(text) {
      if (text.length <= 25) {
        return text;
      }
      return text.slice(0, 22) + '...';
    },
    editionMode(item) {
      console.log('editionMode ON')
      this.$emit('showPCModalDisplay', this.pc)
      this.$emit('editionModePC', this.pc)
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