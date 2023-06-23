<template>

  <div :class="{'is-active': showPcForm}"
  >
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

            <!-- PCs -->
            <div class="is-flex is-justify-content-space-between m-2">
              <label class="label">PC's infos</label>
              <button class="is-small" @click="showpcsPreview=!showpcsPreview">preview</button>
            </div>
            <div :hidden="showpcsPreview">
              <textarea
               @keyup="updatePc"
              class="textarea" placeholder="Informations for the players"
              v-model="pc.data_pc">
              </textarea>
            </div>
            <div @click="showpcsPreview=false"
            :hidden="!showpcsPreview" class="content border p-1 hoverable">
              <div v-html="pcPreview"></div>
            </div>

            <!-- Player -->
            <div class="is-flex is-justify-content-space-between m-2">
              <label class="label">Player's infos</label>
              <button class="is-small" @click="showplayerPreview=!showplayerPreview">preview</button>
            </div>
            <div :hidden="showplayerPreview">
              <textarea
               @keyup="updatePc"
              class="textarea" placeholder="Informations for the player of the character"
              v-model="pc.data_player">
              </textarea>
            </div>
            <div @click="showplayerPreview=false"
            :hidden="!showplayerPreview" class="content border p-1 hoverable">
              <div v-html="playerPreview"></div>
            </div>

            <!-- GM -->
            <div class="is-flex is-justify-content-space-between m-2">
              <label class="label">GM's infos</label>
              <button class="is-small" @click="showgmPreview=!showgmPreview">preview</button>
            </div>
            <div :hidden="showgmPreview">
              <textarea
               @keyup="updatePc"
              class="textarea" placeholder="Informations for the GM only"
              v-model="pc.data_gm">
              </textarea>
            </div>
            <div @click="showgmPreview=false"
            :hidden="!showgmPreview" class="content border p-1 hoverable">
              <div v-html="gmPreview"></div>
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
    }
  },
  computed:{
    pcPCsInfos(){
      return this.pc.data_pc
    },
    pcPreview(){
      let render = ""
      if (this.pcPCsInfos !== null && this.pcPCsInfos !== undefined) {
        render = marked.parse(this.pcPCsInfos)
      }
      return render
    },
    playerInfos(){
      return this.pc.data_player
    },
    playerPreview(){
      let render = ""
      if (this.playerInfos !== null && this.playerInfos !== undefined) {
        render = marked.parse(this.playerInfos)
      }
      return render
    },
    pcGmInfos(){
      return this.pc.data_gm
    },
    gmPreview(){
      let render = ""
      if (this.pcGmInfos !== null && this.pcGmInfos !== undefined) {
        render = marked.parse(this.pcGmInfos)
      }
      return render
    }
  },
  methods: {
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

.hoverable:hover {
  cursor: pointer;
}


</style>