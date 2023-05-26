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
            <input class="input" type="text" placeholder="Text input">
            <label class="label">Type</label>
            <div class="select">
              <select>
                <option v-for="type in itemTypes" :key="type">{{ type }}</option>
              </select>
            </div>
            <div class="is-flex is-justify-content-space-between m-2">
              <label class="label">PC's infos</label>
              <button class="is-small" @click="MDPreview('pcsInfos')">preview</button>
            </div>
            <div :hidden="showpcsPreview">
              <textarea class="textarea" placeholder="Textarea" id="pcsInfos"></textarea>
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
              <textarea class="textarea" placeholder="Textarea" id="gmInfos"></textarea>
            </div>
            <div id="gmInfosPreview" @click="MDPreview('gmInfos')"
            :hidden="!showgmPreview" class="content border p-1">
            </div>


            </div>
          </div>
        </form>
      </section>
      <footer class="modal-card-foot">
        <button class="button is-success">Save</button>
        <button class="button" @click="$emit('closeCreateItemModal')">Cancel</button>
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
        'PLACE',
        'ORGANIZATION',
        'EVENT',
        'NOTE',
        'RECAP',
      ],
      showpcsPreview: false,
      showgmPreview: false,
    }
  },
  methods: {
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
      console.log('preview...', this.MDPreviewContent)

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
  height: 210px;
}

</style>