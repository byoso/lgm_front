<template>


  <div class="modal" :class="{'is-active': showIt}">
    <div class="modal-background" @click="$emit('showModalEdit', item)"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <span class="modal-card-title">{{ itemName }}</span>

        <button class="delete" aria-label="close" @click="$emit('showModalEdit', item)"></button>
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
        <div class="footer-buttons">
          <div class="buttons">
            <button class="button is-small is-success mr-2"
            @click="confirmUpdate(updated_item)">
              Confirm
            </button>
            <button class="button is-small" @click="$emit('showModalEdit', item)">Cancel</button>
            <a class="info-icon tooltip" href="https://www.markdownguide.org/cheat-sheet/" target="_blank">
              <fa icon="circle-info" />
              <span class="tooltiptext">Edition tips</span>
            </a>
          </div>
          <div>
            <button class="button is-warning is-small ml-2" @click="deleteActive=!deleteActive">delete</button>
            <button class="button is-danger is-small" :disabled="deleteActive" @click="deleteItem">
              confirm delete
            </button>
          </div>
          <div class="m-2">
            <p v-for="error in errors" :key="error" style="color: red;">{{ error }}</p>
          </div>
        </div>
      </footer>
    </div>
  </div>



</template>

<script>
import axios from 'axios';


export default {
  name: 'ItemModalEdit',
  props: [
    'item',
    'user',
    'campain',
    'showIt',
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
      itemImageUrl: this.item.image_url,
      itemPCsInfos: this.item.data_pc,
      itemGmInfos: this.item.data_gm,
      deleteActive: true,
    }
  },
  computed: {
    isGameMaster() {
      return this.user.id === this.campain.game_master.user.id
    },
  },
  methods: {
    deleteItem() {
      this.errors = []
      let id = this.item.id;
      axios({
        method: 'delete',
        url: '/campains/items/delete/',
        headers: {
          Authorization: `Token ${this.$store.state.token}`
        },
        data: {
          id: id,
        }
      }).then(response => {
        this.$emit('itemDeleted', id);
      }).catch(error => {
        this.errors.push(error.response.data.message);
      })

    },
    confirmUpdate() {
      this.errors = [];
      if (this.itemName === '') {
        this.errors.push('Name required.');
        return
      }
      if (!this.isGameMaster) {
        this.itemType = 'MEMO'
      }
      if (this.itemType === '') {
        this.errors.push('Type required.');
        return
      }
      let new_item = {
        id: this.item.id,
        name: this.itemName,
        type: this.itemType,
        image_url: this.itemImageUrl,
        data_pc: this.itemPCsInfos,
        data_gm: this.itemGmInfos,
      }
      console.log('new_item: ', new_item)
      axios({
        method: 'put',
        url: '/campains/items/update/',
        headers: {
          Authorization: `Token ${this.$store.state.token}`
        },
        data: new_item
      }).then(response => {
        console.log(response)
        this.$emit('itemUpdated', response.data)
        this.$emit('showModalEdit', new_item)

      }).catch(error => {
        this.errors.push(error.response.data.message);
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
.info-icon {
  color: #3273dc;
  margin-right: 5px;
  margin-left: 5px;
}

.footer-buttons {
  display: flex;
  justify-content: space-between;
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

.border {
  border: 1px solid black;
  cursor: pointer;
}

textarea {
  height: 160px;
}

</style>