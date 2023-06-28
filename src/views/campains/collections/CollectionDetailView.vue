<template>
<div class="" @keydown.ctrl.s.prevent.stop="saveCollection">
  <div class="columns">
    <!-- left column -->
    <div class="column left-column">
      <h1 class="subtitle">{{ collection.name.slice(0, 25) }}</h1>
      <div class="center-elems unscrollable">
        <button class="button is_secondary is-small" v-if="anyModif" @click="cancel">Cancel</button>
        <button class="button is-success is-small ml-2" @click="saveCollection" id="save-button">Save Collection</button>
        <button class="button is-warning is-small ml-2" @click="allowDeletion=!allowDeletion">
          <span v-if="!allowDeletion">
            Delete Collection
          </span>
          <span v-else>
            NO ! Cancel !
          </span>
        </button>
        <div v-if="allowDeletion">
          <span style="color: red;" class="m-2">Are you really sure ?</span>
          <button class="button is-danger is-small ml-2" @click="deleteCollection">
            YES ! Confirm deletion
          </button>
        </div>
      </div>


      <div class="scrollable">
        <!-- details section -->

        <div @click="showEdit = !showEdit" class="topic">Edit
          <div class="is-pulled-right mr-2">
            <fa v-if="showEdit" icon="angle-down"/>
            <fa v-if="!showEdit" icon="angle-right"/>
          </div>
        </div>
        <div v-if="showEdit">

          <div class="field is-horizontal mt-2">
            <div class="field-label">
              <label class="label is-small">Name</label>
            </div>
            <div class="field-body">
              <div class="field">
                <div class="control">
                  <input class="input is-small" type="text" placeholder="Collection name" v-model="collection.name">
                </div>
              </div>
            </div>
          </div>

          <div class="field is-horizontal">
            <div class="field-label">
              <label class="label is-small">Game</label>
            </div>
            <div class="field-body">
              <div class="field">
                <div class="control">
                  <input class="input is-small" type="text" placeholder="Game" v-model="collection.game">
                </div>
              </div>
            </div>
          </div>

          <div class="field is-horizontal">
            <div class="field-label">
              <label class="label is-small">language</label>
            </div>
            <div class="field-body">
              <div class="field">
                <div class="control">
                  <select v-model="collection.language" class="is-small">
                    <option value="ar">Arabic</option>
                    <option value="cs">Czech</option>
                    <option value="zh">Chinese</option>
                    <option value="da">Danish</option>
                    <option value="nl">Dutch</option>
                    <option value="en">English</option>
                    <option value="fi">Finnish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                    <option value="el">Greek</option>
                    <option value="hi">Hindi</option>
                    <option value="hu">Hungarian</option>
                    <option value="it">Italian</option>
                    <option value="ja">Japanese</option>
                    <option value="ko">Korean</option>
                    <option value="no">Norwegian</option>
                    <option value="fa">Persian</option>
                    <option value="pl">Polish</option>
                    <option value="pt">Portuguese</option>
                    <option value="ru">Russian</option>
                    <option value="es">Spanish</option>
                    <option value="sv">Swedish</option>
                    <option value="th">Thai</option>
                    <option value="tr">Turkish</option>
                    <option value="vi">Vietnamese</option>

                  </select>
                </div>
              </div>
            </div>
          </div>

          <div class="field is-horizontal">
            <div class="field-label">
              <label class="label is-small">Image url</label>
            </div>
            <div class="field-body">
              <div class="field">
                <div class="control">
                  <input class="input is-small" type="text" placeholder="Image url" v-model="collection.image_url">
                </div>
              </div>
            </div>
          </div>

          <div class="field is-horizontal">
            <div class="field-label">
              <label class="label is-small">Description</label>
            </div>
            <div class="field-body">
              <div class="field">
                <div class="control">
                  <textarea class="textarea is-small"
                  placeholder="Description" v-model="collection.description">
                  </textarea>
                </div>
              </div>
            </div>
          </div>

          <p class="m-4">
              <label class="label">Share with the community:
                <input type="checkbox" v-model="collection.is_shared">
              </label>
              <label class="label">
                Is totally free (no copyright, users may use your creations in their own shared collections) ?
              </label>
              <button @click="IUnderstand = true" class="button is-small is-warning mr-4">
                I understand
              </button>
              <input type="checkbox" v-model="collection.is_copy_free"
              @click="IUnderstand = false"
              :disabled="copyFreeCheckbox">
          </p>
          <div class="center-elems">
            <img :src="collection.image_url"
            alt="[image not found]" v-if="collection.image_url!==''">
          </div>

        </div>

        <!-- items section -->

        <div @click="showItems = !showItems" class="topic">Items
          <div class="is-pulled-right mr-2">
            <fa v-if="showItems" icon="angle-down"/>
            <fa v-if="!showItems" icon="angle-right"/>
          </div>
        </div>
        <div v-if="showItems">
          <p class="hoverable" @click="createItem">+ New Item</p>
          <table v-if="itemList.length" class="table is-fullwidth is-narrow">
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in itemList" :key="item.id" class="hoverable is-small" @click="editItem(item)"
              :class="{'item-creation': item.id.startsWith('temp_id_')}"
              >
                <td >{{item.name}}</td>
                <td :class="item.type">{{item.type}}</td>
              </tr>
            </tbody>
          </table>

        </div>


        <!-- PCs section -->

        <div @click="showPCs = !showPCs" class="topic">PCs
          <div class="is-pulled-right mr-2">
            <fa v-if="showPCs" icon="angle-down"/>
            <fa v-if="!showPCs" icon="angle-right"/>
          </div>
        </div>
        <div v-if="showPCs">
          <p class="hoverable" @click="createPc">+ New PC</p>
          <table v-if="pcList.length" class="table is-fullwidth is-narrow">
            <thead>
              <tr>
                <th>Name</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="pc in pcList" :key="pc.id" class="hoverable is-small" @click="editPc(pc)"
              :class="{'item-creation': pc.id.startsWith('temp_id_')}"
              >
                <td >{{pc.name}}</td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>


    </div>

    <!-- right column -->
    <div class="column is-6">
      <div class="unscrollable">
        <div v-if="showItemForm">
          <h1 class="subtitle" :class="itemToEdit.type">{{ itemToEdit.name }}</h1>
        </div>
        <div v-if="showPcForm">
          <h1 class="subtitle edit-title">{{ pcToEdit.name }}</h1>
        </div>
      </div>

      <div class="scrollable">
        <ItemForm  v-if="showItemForm"
        :showItemForm="showItemForm"
        :item="itemToEdit"
        @updateItem="updateItem($event)"
        @deleteItem="deleteItem($event)"
        />

        <PcForm  v-if="showPcForm"
        :showPcForm="showPcForm"
        :pc="pcToEdit"
        @updatePc="updatePc($event)"
        @deletePc="deletePc($event)"
        />
      </div>
    </div>


  </div>


</div>

</template>

<script>
import axios from 'axios';
import {toast} from 'bulma-toast';
import ItemForm from './components/ItemForm.vue'
import PcForm from './components/PcForm.vue'

export default {
  name: 'CollectionDetailView',
  components: {
    ItemForm,
    PcForm,
  },
  data(){
    return {
      IUnderstand: false,
      initID: 0,
      showEdit: true,
      showItems: false,
      showPCs: false,
      allowDeletion: false,
      collection: {},
      id: null,
      showItemForm: false,
      showPcForm: false,
      itemList: [],
      pcList: [],
      itemToEdit: {},
      itemCreatedList: {},
      itemUpdatedList: {},
      itemDeletedList: [],
      pcToEdit: {},
      pcCreatedList: {},
      pcUpdatedList: {},
      pcDeletedList: [],
    }
  },
  beforeMount(){
    this.id = this.$route.params.id
    this.getCollectionDetail()
  },
  computed: {
    copyFreeCheckbox(){
      if (this.IUnderstand) {
        return false
      } else if (this.collection.is_copy_free) {
        return false
      } else {
        return true
      }

    },
    anyModif() {
      return Object.keys(this.itemCreatedList).length > 0 ||
      Object.keys(this.itemUpdatedList).length > 0 ||
      this.itemDeletedList.length > 0 ||
      Object.keys(this.pcCreatedList).length > 0 ||
      Object.keys(this.pcUpdatedList).length > 0
    },
  },
  methods: {
    cancel(){
      this.$router.push({name: 'CollectionsView'})
    },
    get_temp_id() {
      this.initID += 1
      return "temp_id_" + this.initID.toString()
    },
    editPc(pc) {
      this.showItemForm = false
      this.showPcForm = true
      this.pcToEdit = pc
      console.log('pcToEdit: ', this.pcToEdit.name)
    },
    editItem(item) {
      this.showPcForm = false
      this.showItemForm = true
      this.itemToEdit = item
      console.log('itemToEdit: ', this.itemToEdit.name)
    },
    updatePc(pc){
      console.log('modified pc: ', pc)
      if (pc.id.startsWith('temp_id_')) {
        this.pcCreatedList[pc.id] = pc
      }
      else {
        this.pcUpdatedList[pc.id] = pc
      }
      console.log('itemUpdatedList: ', this.pcUpdatedList)
      console.log('itemCreatedList: ', this.pcCreatedList)

    },
    updateItem(item) {
      console.log('modified item: ', item)
      if (item.id.startsWith('temp_id_')) {
        this.itemCreatedList[item.id] = item
      }
      else {
        this.itemUpdatedList[item.id] = item
      }
      console.log('itemUpdatedList: ', this.itemUpdatedList)
      console.log('itemCreatedList: ', this.itemCreatedList)
    },
    createPc() {
      console.log('create pc')
      let new_pc = {
        id: this.get_temp_id(),
        name: "New PC",
        }
      this.pcList.unshift(new_pc)
      this.pcCreatedList[new_pc.id] = new_pc
      console.log('pcCreatedList: ', this.pcCreatedList)
      console.log('pcUpdatedList: ', this.pcUpdatedList)
    },
    createItem() {
      let new_item = {
        id: this.get_temp_id(),
        name: "New Item",
        type: "MEMO",
        }
      this.itemList.unshift(new_item)
      this.itemCreatedList[new_item.id] = new_item
      console.log('itemCreatedList: ', this.itemCreatedList)
      console.log('itemUpdatedList: ', this.itemUpdatedList)
    },
    deletePc(id){
      this.pcList = this.pcList.filter(pc => pc.id !== id)
      // If the pc is not a temporary pc, add it to the list of pcs to delete
      if (!id.startsWith('temp_id_')) {
        this.pcDeletedList.push(id)
      }
      // If the pc is a temporary pc, remove it from the list of pcs to create
      else {
        delete this.pcCreatedList[id]
      }
      // anyway, remove the pc from the list of pcs to update
      delete this.pcUpdatedList[id]
      this.showPcForm = false
      this.pcToEdit = {}

      console.log('delete pc: ', id)
      console.log('pcUpdatedList', this.pcUpdatedList)
      console.log('pcCreatedList: ', this.pcCreatedList)
      console.log('pcDeletedList: ', this.pcDeletedList)

    },
    deleteItem(id){
      this.itemList = this.itemList.filter(item => item.id !== id)
      // If the item is not a temporary item, add it to the list of items to delete
      if (!id.startsWith('temp_id_')) {
        this.itemDeletedList.push(id)
      }
      // If the item is a temporary item, remove it from the list of items to create
      else {
        delete this.itemCreatedList[id]
      }
      // anyway, remove the item from the list of items to update
      delete this.itemUpdatedList[id]
      this.showItemForm = false
      this.itemToEdit = {}

      console.log('delete item: ', id)
      console.log('itemUpdatedList', this.itemUpdatedList)
      console.log('itemCreatedList: ', this.itemCreatedList)
      console.log('itemDeletedList: ', this.itemDeletedList)
    },
    getCollectionDetail(){
      axios({
        method: 'get',
        url: `/campains/collection/`,
        headers: {
          'Authorization': `Token ${this.$store.state.token}`
        },
        params: {
          id: this.id,
        }
      })
      .then(response => {
        this.collection = response.data.collection_details
        this.itemList = response.data.items
        this.pcList = response.data.pcs
        // console.log(this.collection)
        this.itemCreatedList = {}
        this.itemUpdatedList = {}
        this.itemDeletedList = []
        this.pcCreatedList = {}
        this.pcUpdatedList = {}
        this.pcDeletedList = []

        if ('id' in this.itemToEdit) {
          if (this.itemToEdit.id.startsWith('temp_id_')){
            this.itemToEdit = {}
            this.showItemForm = false
          }
        }
        if ('id' in this.pcToEdit) {
          if (this.pcToEdit.id.startsWith('temp_id_')){
            this.pcToEdit = {}
            this.showPcForm = false
          }
        }
      })
      .catch(error => {
        console.log(error);
      });
    },
    deleteCollection(){
      axios({
        method: 'delete',
        url: `campains/collections_crud/`,
        headers: {
          'Authorization': `Token ${this.$store.state.token}`
        },
        data: {
          id: this.id,
        }
      })
      .then(response => {
        this.$router.push({name: 'CollectionsView'})
      })
      .catch(error => {
        console.log(error.message);
      });
    },
    saveCollection(){
      axios({
        method: 'put',
        url: `campains/collections_crud/`,
        headers: {
          'Authorization': `Token ${this.$store.state.token}`
        },
        data: {
          id: this.id,
          name: this.collection.name,
          game: this.collection.game,
          language: this.collection.language,
          description: this.collection.description,
          image_url: this.collection.image_url,
          is_shared: this.collection.is_shared,
          is_copy_free: this.collection.is_copy_free,
          // items actions
          items_to_create: this.itemCreatedList,
          items_to_update: this.itemUpdatedList,
          items_to_delete: this.itemDeletedList,
          // pcs actions
          pcs_to_create: this.pcCreatedList,
          pcs_to_update: this.pcUpdatedList,
          pcs_to_delete: this.pcDeletedList,
        }
      })
      .then(response => {
        toast({
          message: 'Collection saved',
          type: 'is-success',
          position: 'bottom-right',
          dismissible: true,
          pauseOnHover: true,
          duration: 2000,
        });
        console.log(response.data)
        this.getCollectionDetail()
      })
      .catch(error => {
        toast({
          message: 'Saving aborted: something went wrong !',
          type: 'is-danger',
          position: 'bottom-right',
          dismissible: true,
          pauseOnHover: true,
          duration: 2000,
        });
        console.log(error.message);
      });
    }

  },

}
</script>

<style scoped>
.left-column{
  margin-top: -40px;
}
.unscrollable{
  margin-top: -40px;
}
.scrollable {
  margin-top: 5px;
  padding: 15px;
  height: 80vh;
  overflow-y: auto;
  overflow-x: hidden;
}

.edit-title {
  background-color: rgb(209, 209, 209);
}
.center-elems {
  margin-right: 4px;
  display: flex;
  justify-content: center;
}

img {
  height: 256px;
  width: auto;
}
.topic {
  background-color: lightseagreen;
  color: white;
  cursor: pointer;
  border: 1px solid rgb(106, 227, 221);
  border-radius: 5px;
}
.topic:hover {
  background-color: rgb(130, 234, 229);
  color: rgb(92, 92, 92);
}

.hoverable:hover {
  background-color: rgb(176, 255, 210);
  color: rgb(92, 92, 92);
  cursor: pointer;
}

.item-creation {
  background-color: rgb(192, 209, 255);
}


.NPC {
  background-color: #ffa76d;
}
.ORGANIZATION {
  background-color: #8a9df3;
}
.EVENT {
  background-color: #ec746c;
}
.LOCATION {
  background-color: #7bc881;
}
.NOTE {
  background-color: #a8dae3;
}
.RECAP {
  background-color: #d096e4;
}
.MISC {
  background-color: #bbbbbb;
}
.MEMO {
  background-color: #f5e570;
}

</style>