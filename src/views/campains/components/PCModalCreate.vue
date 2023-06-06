<template>

  <div class="modal mt-6" :class="{'is-active': showCreatePCModal}">
    <div class="modal-background" @click="$emit('closeCreatePCModal')"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Create a new PC</p>
        <button class="delete" aria-label="close" @click="$emit('closeCreatePCModal')"></button>
      </header>
      <section class="modal-card-body">
        <form>
          <div class="control">
            <div v-if="isGameMaster">
              <label class="label">Player</label>
              <div class="select">
                <select v-model="player_id">
                  <option value="">None</option>
                  <option v-for="user in players" :key="user.id" :value="user.id">{{ user.username }}</option>
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
        <button class="button is-small" @click="$emit('closeCreatePCModal')">Cancel</button>
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
import axios from 'axios';

export default {
  name: 'PCModalCreate',
  props: [
    'user',
    'campain',
    'showCreatePCModal',
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
    }
  },
  beforeMount() {
    console.log("campain in PCModal: ", this.campain)
    this.players = this.campain.table.owners.concat(this.campain.table.guests)
    console.log("players: ", this.players)
  },
  methods: {
    onSubmit(){
      if (this.player_id === '') {
        this.player_id = null
      }
      console.log("submit...")
      let data = {
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
        method: 'post',
        url: '/campains/pc/create/',
        data: data,
        headers: {
          Authorization:  `Token ${this.$store.state.token}`
        }
      })
      .then(response => {
        console.log(response.data)
        this.$emit('closeCreatePCModal')
        this.$emit('addPC')
      })
      .catch(error => {
        console.log(error.response)
        this.errors = error.response.data
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