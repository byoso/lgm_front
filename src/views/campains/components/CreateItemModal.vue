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
            <label class="label">Title</label>
            <input class="input" type="text" placeholder="Title" v-model="itemTitle">
            <label class="label">Image url (optionnal)</label>
            <input class="input" type="text" placeholder="image url" v-model="itemImageUrl">
            <label class="label">Type</label>
            <div class="select">
              <select v-model="itemType">
                <option v-for="type in itemTypes" :key="type">{{ type }}</option>
              </select>
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

            <div v-if="user.id === campain.game_master.user.id">
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
        <button class="button is-success" @click.prevent="onSubmit()">Save</button>
        <button class="button" @click="$emit('closeCreateItemModal')">Cancel</button>
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
  components: {
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
      ],
      showpcsPreview: false,
      showgmPreview: false,
      errors: [],
      itemTitle: '',
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
      if (this.itemTitle === '') {
        this.errors.push('Title required.')
        return
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
          title: this.itemTitle,
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

</style>