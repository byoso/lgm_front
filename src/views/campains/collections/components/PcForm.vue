<template>

  <div :class="{'is-active': showPcForm}">
        <form>
          <div class="control">
            <div v-if="pc.id.startsWith('temp_id_')" class="item-creation">* PC Creation</div>
            <label class="label">Name</label>
            <input class="input" type="text" placeholder="Name" v-model="pc.name" @keyup="updatePc">
            <label class="label">Image url</label>
            <div class="center-elems">
              <input class="input mr-2" type="text" placeholder="image url"
              v-model="pc.image_url"  @keyup="updatePc"
              >
              <img v-if="pc.image_url" :src="pc.image_url" alt="not found" class="image-preview">
              <img v-else src="https://bulma.io/images/placeholders/128x128.png" alt="not found" class="image-preview">

            </div>

            <div class="is-flex is-justify-content-space-between m-2">
              <label class="label">PC's infos</label>
              <button class="is-small" @click="MDPreview('pcsInfos')">preview</button>
            </div>
            <div :hidden="showpcsPreview">
              <textarea
               @keyup="updatePc"
              class="textarea" placeholder="Informations for the players"
              id="pcsInfos" v-model="pc.data_pc">
              </textarea>
            </div>
            <div id="pcsInfosPreview" @click="MDPreview('pcsInfos')"
            :hidden="!showpcsPreview" class="content border p-1">
            </div>

            <div class="is-flex is-justify-content-space-between m-2">
              <label class="label">Player's infos</label>
              <button class="is-small" @click="MDPreview('playerInfos')">preview</button>
            </div>
            <div :hidden="showplayerPreview">
              <textarea
               @keyup="updatePc"
              class="textarea" placeholder="Informations for the player of the character"
              id="playerInfos" v-model="pc.data_player">
              </textarea>
            </div>
            <div id="playerInfosPreview" @click="MDPreview('playerInfos')"
            :hidden="!showpcsPreview" class="content border p-1">
            </div>


            <div class="is-flex is-justify-content-space-between m-2">
              <label class="label">GM's infos</label>
              <button class="is-small" @click="MDPreview('gmInfos')">preview</button>
            </div>
            <div :hidden="showgmPreview">
              <textarea
               @keyup="updatePc"
              class="textarea" placeholder="Informations for the GM only"
              id="gmInfos" v-model="pc.data_gm">
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
          <button class="button is-danger is-small" @click="$emit('deletePc', pc.id)">Delete</button>
        </div>

  </div>
</template>

<script>
export default {
  name: 'PcForm',
  props: [
    'showPcForm',
    'pc',
  ],
  data() {
    return {
      showpcsPreview: false,
      showplayerPreview: false,
      showgmPreview: false,
      errors: [],
      pcName: this.pc.name,
      pcImageUrl: this.pc.imageUrl,
      pcPCsInfos: this.pc.pcsInfos,
      pcGmInfos: this.pc.gmInfos,
    }
  },
  methods: {
    MDPreview(textId) {
      if (textId === 'pcsInfos') {
        this.showpcsPreview = !this.showpcsPreview
      } else if (textId === 'gmInfos') {
        this.showgmPreview = !this.showgmPreview
      } else if (textId === 'playerInfos') {
        this.showplayerPreview = !this.showplayerPreview
      }
      let elem = document.getElementById(textId);
      let text = elem.value;
      this.MDPreviewContent = marked.parse(text)
      let previewElem = document.getElementById(textId + 'Preview')
      previewElem.innerHTML = this.MDPreviewContent
    },
    updatePc() {
      this.$emit('updatePc', this.pc)
    },
    deletePc(pc) {
      this.$emit('deletePc', pc.id)
    },
  }

}
</script>

<style scoped>
img {
  color: red;
}

.image-preview {
  max-width: 40px;
  max-height: 40px;
}

.center-elems {
  margin: 4px;
  display: flex;
  justify-content: center;
}

.item-creation {
  background-color: rgb(192, 209, 255);
}


</style>