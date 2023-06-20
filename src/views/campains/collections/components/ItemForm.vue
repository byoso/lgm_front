<template>

  <div :class="{'is-active': showItemForm}">
        <form>
          <div class="control">
            <label class="label">Name</label>
            <input class="input" type="text" placeholder="Name" v-model="item.name" @keyup="updateItem">
            <label class="label">Image url</label>
            <div class="center-elems">
              <input class="input mr-2" type="text" placeholder="image url"
              v-model="item.image_url"  @keyup="updateItem"
              >
              <img v-if="item.image_url" :src="item.image_url" alt="not found" class="image-preview">
              <img v-else src="https://bulma.io/images/placeholders/128x128.png" alt="not found" class="image-preview">

            </div>
              <label class="label">Type</label>
              <div class="select"  @change="updateItem">
                <select v-model="item.type">
                  <option v-for="type in itemTypes" :key="type">{{ type }}</option>
                </select>
              </div>


            <div class="is-flex is-justify-content-space-between m-2">
              <label class="label">PC's infos</label>
              <button class="is-small" @click="MDPreview('pcsInfos')">preview</button>
            </div>
            <div :hidden="showpcsPreview">
              <textarea
               @keyup="updateItem"
              class="textarea" placeholder="Informations for the players"
              id="pcsInfos" v-model="item.data_pc">
              </textarea>
            </div>
            <div id="pcsInfosPreview" @click="MDPreview('pcsInfos')"
            :hidden="!showpcsPreview" class="content border p-1">
            </div>


            <div class="is-flex is-justify-content-space-between m-2">
              <label class="label">GM's infos</label>
              <button class="is-small" @click="MDPreview('gmInfos')">preview</button>
            </div>
            <div :hidden="showgmPreview">
              <textarea
               @keyup="updateItem"
              class="textarea" placeholder="Informations for the GM only"
              id="gmInfos" v-model="item.data_gm">
              </textarea>
            </div>
            <div id="gmInfosPreview" @click="MDPreview('gmInfos')"
            :hidden="!showgmPreview" class="content border p-1">
            </div>

          </div>
        </form>
        <div>
          <p v-for="error in errors" :key="error" style="color: red;">{{ error }}</p>
        </div>
        <div class="mt-2">
          <button class="button is-danger is-small" @click="$emit('deleteItem', item.id)">Delete</button>
        </div>

  </div>
</template>

<script>
export default {
  name: 'ItemForm',
  props: [
    'showItemForm',
    'item',
  ],
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
      itemName: this.item.name,
      itemType: this.item.type,
      itemImageUrl: this.item.imageUrl,
      itemPCsInfos: this.item.pcsInfos,
      itemGmInfos: this.item.gmInfos,
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
    },
    updateItem() {
      this.$emit('updateItem', this.item)
    },
    deleteItem(item) {
      this.$emit('deleteItem', item.id)
    },
  }

}
</script>

<style scoped>
.image-preview {
  max-width: 40px;
  max-height: 40px;
}

.center-elems {
  margin: 4px;
  display: flex;
  justify-content: center;
}

</style>