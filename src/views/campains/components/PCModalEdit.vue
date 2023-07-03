<template>

  <div class="modal mt-6" :class="{'is-active': showIt}">
    <div class="modal-background" @click="$emit('closeEditPCModal')"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">{{ charLimit(name) }}</p>
        <button class="delete" aria-label="close" @click="$emit('closeEditPCModal')"></button>
      </header>
      <section class="modal-card-body">
        <form>
          <div class="control">
            <div v-if="isGameMaster">
              <label class="label">Player</label>
              <div class="select">
                <select v-model="player_id">
                  <option value="">None</option>
                  <option v-for="user in players" :key="user.id" :value="user.id">
                    {{ charLimit(user.username) }}
                  </option>
                </select>
              </div>

            </div>
            <label class="label">Name</label>
            <input class="input" type="text" placeholder="Name" v-model="name">
            <label class="label">Image url (optionnal)</label>
            <input class="input" type="text" placeholder="image url" v-model="image_url">

            <div class="is-flex is-justify-content-space-between m-2">
              <label class="label">Other players infos</label>
              <button class="is-small" @click="MDPreview('pcsInfos')">preview</button>
            </div>
            <div :hidden="showpcsPreview">
              <textarea class="textarea" placeholder="Informations for the other players" id="pcsInfos" v-model="pcs_infos"></textarea>
            </div>
            <div id="pcsInfosPreview" @click="MDPreview('pcsInfos')"
            :hidden="!showpcsPreview" class="content border p-1">
            </div>


            <div v-if="isGameMaster | isPlayer">
              <div class="is-flex is-justify-content-space-between m-2">
                <label class="label">Player's infos</label>
                <button class="is-small" @click="MDPreview('playerInfos')">preview</button>
              </div>
              <div :hidden="showplayerPreview">
                <textarea class="textarea" placeholder="Informations for the player only" id="playerInfos" v-model="player_infos"></textarea>
              </div>
              <div id="playerInfosPreview" @click="MDPreview('playerInfos')"
              :hidden="!showplayerPreview" class="content border p-1">
              </div>
            </div>

            <div v-if="isGameMaster">
              <div class="is-flex is-justify-content-space-between m-2">
                <label class="label">GM's infos</label>
                <button class="is-small" @click="MDPreview('gmInfos')">preview</button>
              </div>
              <div :hidden="showgmPreview">
                <textarea class="textarea" placeholder="Informations for the GM only" id="gmInfos" v-model="gm_infos"></textarea>
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
        <button class="button is-small" @click="$emit('closeEditPCModal')">Cancel</button>
        <a class="info-icon tooltip" href="https://www.markdownguide.org/cheat-sheet/" target="_blank">
          <fa icon="circle-info" />
          <span class="tooltiptext">Edition tips</span>
        </a>
        <div v-if="isGameMaster">
          <button class="button is-warning is-small ml-2" @click="deleteActive=!deleteActive">delete</button>
          <button class="button is-danger is-small" :disabled="deleteActive" @click="deletePC">
            confirm delete
          </button>
        </div>
        <div>
          <p v-for="error in errors" :key="error" style="color: red;">{{ error }}</p>
        </div>
      </footer>
    </div>

  </div>

</template>

<script>
import axios from 'axios';

export default {
  name: 'PCModalEdit',
  props: [
    'user',
    'pc',
    'showIt',
    'campain',
    'showEditPCModal',
  ],
  computed: {
    isGameMaster() {
      return this.user.id === this.campain.game_master.id
    },
    isPlayer() {
      if (this.player_id !== null) {
        return this.user.id === this.player_id
      } else {
        return false
      }
    },
  },
  data() {
    return {
      showpcsPreview: false,
      showplayerPreview: false,
      showgmPreview: false,
      errors: [],
      name: '',
      image_url: '',
      player_id: null,
      players: [],
      pcs_infos: '',
      player_infos: '',
      gm_infos: '',
      id: null,
      deleteActive: true,
    }
  },
  beforeMount() {
    console.log("campain in PCModal: ", this.campain)
    this.players = this.campain.table.owners.concat(this.campain.table.guests)
    console.log("players: ", this.players)
    this.name = this.pc.name
    this.image_url = this.pc.image_url
    if (this.pc.user !== null) {
      this.player_id = this.pc.user.id
    } else {
      this.player_id = null
    }
    this.pcs_infos = this.pc.data_pc
    this.player_infos = this.pc.data_player
    this.gm_infos = this.pc.data_gm
    this.id = this.pc.id
  },
  methods: {
    charLimit(text) {
      if (text.length <= 25) {
        return text;
      }
      return text.slice(0, 22) + '...';
    },
    deletePC(){
      this.errors = []
      axios({
        method: 'delete',
        url: '/campains/pc/delete/',
        data: {
          id: this.id,
          campain_id: this.campain.id,
        },
        headers: {
          Authorization:  `Token ${this.$store.state.token}`
        }
      })
      .then(
        this.$emit('deletePC', this.id),
        this.$emit('closeEditPCModal')
      )
      .catch(error => {
        console.log(error.response.data)
      })
    },
    onSubmit(){
      if (this.player_id === '') {
        this.player_id = null
      }
      console.log("submit...")
      let data = {
        id: this.id,
        campain_id: this.campain.id,
        name: this.name,
        image_url: this.image_url,
        player_id: this.player_id,
        data_pc: this.pcs_infos,
        data_player: this.player_infos,
        data_gm: this.gm_infos,
      }
      console.log(data)
      axios({
        method: 'put',
        url: '/campains/pc/update/',
        data: data,
        headers: {
          Authorization:  `Token ${this.$store.state.token}`
        }
      })
      .then(response => {
        this.$emit('updatePC', response.data)
        this.$emit('closeEditPCModal')
      })
      .catch(error => {
        console.log(error.response.data.message)
        this.errors.push(error.response.data.message)
      })

    },
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
      console.log('preview...')

    },
  },

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