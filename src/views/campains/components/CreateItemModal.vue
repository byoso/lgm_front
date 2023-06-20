<template>
  <div class="modal" :class="{'is-active': showCreateItemModal}">
    <div class="modal-background" @click="$emit('closeCreateItemModal')"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Create a new item</p>
        <button class="delete" aria-label="close" @click="$emit('closeCreateItemModal')"></button>
      </header>
      <section class="modal-card-body">
        <form>
          <div class="control">
            <label class="label">Name</label>
            <input class="input" type="text" placeholder="Name" v-model="itemName">
            <label class="label">Image url (optionnal)</label>
            <input class="input" type="text" placeholder="image url" v-model="itemImageUrl">
            <div v-if="isGameMaster">
              <label class="label">Type</label>
              <div class="select">
                <select v-model="itemType">
                  <option v-for="type in itemTypes" :key="type">{{ type }}</option>
                </select>
              </div>

            </div>
            <div class="is-flex is-justify-content-space-between m-2">
              <label class="label">PC's infos</label>
              <button class="is-small" @click="MDPreview('pcsInfos')">preview</button>
            </div>
            <div :hidden="showpcsPreview">
              <textarea class="textarea" placeholder="Informations for the players" id="pcsInfos" v-model="itemPCsInfos"></textarea>
            </div>
            <div id="pcsInfosPreview" @click="MDPreview('pcsInfos')"
            :hidden="!showpcsPreview" class="content border p-1">
            </div>

            <div v-if="isGameMaster">
            <div class="is-flex is-justify-content-space-between m-2">
              <label class="label">GM's infos</label>
              <button class="is-small" @click="MDPreview('gmInfos')">preview</button>
            </div>
            <div :hidden="showgmPreview">
              <textarea class="textarea" placeholder="Informations for the GM only" id="gmInfos" v-model="itemGmInfos"></textarea>
            </div>
            <div id="gmInfosPreview" @click="MDPreview('gmInfos')"
            :hidden="!showgmPreview" class="content border p-1">
            </div>

            </div>
          </div>
        </form>
      </section>
      <footer class="modal-card-foot">
        <button class="button is-success is-small" @click.prevent="onSubmit()">Save</button>
        <button class="button is-small" @click="$emit('closeCreateItemModal')">Cancel</button>
        <a class="info-icon tooltip" href="https://www.markdownguide.org/cheat-sheet/" target="_blank">
          <fa icon="circle-info" />
          <span class="tooltiptext">Edition tips</span>
        </a>
        <div>
          <p v-for="error in errors" :key="error" style="color: red;">{{ error }}</p>
        </div>
      </footer>
    </div>

  </div>

</template>

<script>
import axios from 'axios'

export default {
  name: 'CreateItemModal',
  props: [
    'showCreateItemModal',
    'campain',
    'user',
  ],
  computed: {
    isGameMaster() {
      return this.user.id === this.campain.game_master.id
    }
  },
  data() {
    return {
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
      showpcsPreview: false,
      showgmPreview: false,
      errors: [],
      itemName: '',
      itemType: null,
      itemImageUrl: '',
      itemPCsInfos: '',
      itemGmInfos: '',
      item: {},
    }
  },
  methods: {
    onSubmit() {
      this.errors = []
      if (!this.isGameMaster) {
        this.itemType = 'MEMO'
      }
      if (this.itemType === null) {
        this.errors.push('Type required.')
        return
      }
      console.log("submit...")
      axios({
        method: 'post',
        url: '/campains/items/create/',
        headers: {
          Authorization: `Token ${this.$store.state.token}`
        },
        data: {
          campainId: this.campain.id,
          title: this.itemName,
          type: this.itemType,
          image_url: this.itemImageUrl,
          pcsInfos: this.itemPCsInfos,
          gmInfos: this.itemGmInfos,
        }
      })
      .then(response => {
        this.$emit('addItem')
        this.$emit('closeCreateItemModal')
      })
      .catch(error => {
        console.log(error)
      })
    },
    MDPreview(textId) {
      if (textId === 'pcsInfos') {
        this.showpcsPreview = !this.showpcsPreview
      } else if (textId === 'gmInfos') {
        this.showgmPreview = !this.showgmPreview
      }
      let elem = document.getElementById(textId);
      let text = elem.value;
      this.MDPreviewContent = marked.parse(text)
      let previewElem = document.getElementById(textId + 'Preview')
      previewElem.innerHTML = this.MDPreviewContent
      console.log('preview...')

    },

  }

}
</script>

<style scoped>
.border {
  border: 1px solid black;
  cursor: pointer;
}

textarea {
  height: 160px;
}

/* Tooltip container */
.tooltip {
  position: relative;
  display: inline-block;
}

.tooltip:hover {
  cursor: pointer;
}

/* Tooltip text */
.tooltip .tooltiptext {
  visibility: hidden;
  background-color: rgb(65, 65, 65);
  color: #e1e1e1;
  text-align: center;
  padding: 2px;
  margin-top: -25px;
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