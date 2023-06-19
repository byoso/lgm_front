<template>
<div class="container">
  <div class="columns">
    <!-- left column -->
    <div class="column">

      <div class="center-elems">
        <button class="button is-success is-small" @click="saveCollection">Save Collection</button>
        <button class="button is-warning is-small ml-2" @click="allowDeletion=!allowDeletion">Delete Collection</button>
        <button class="button is-danger is-small ml-2" :disabled="!allowDeletion" @click="deleteCollection">Confirm deletion</button>
      </div>

      <!-- details section -->
      <h1 class="title">{{ collection.name }}</h1>

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

        <p>
            <label class="label">Share with the community:
              <input type="checkbox" v-model="collection.is_shared">
            </label>
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
            <tr v-for="item in itemList" :key="item.id" class="hoverable is-small" @click="editItem(item)">
              <td >{{item.name}}</td>
              <td>{{item.type}}</td>
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
        <p class="hoverable" @click="createPC">+ New PC</p>
      </div>

    </div>

    <!-- right column -->
    <div class="column is-5">
      <ItemForm
      :showItemForm="showItemForm"
      :item="itemToEdit"
      @modifiedItem="modifiedItem($event)"
      />

    </div>

  </div>


</div>

</template>

<script>
import axios from 'axios';
import {toast} from 'bulma-toast';
import ItemForm from './components/ItemForm.vue'
import PCForm from './components/PCForm.vue'

export default {
  name: 'CollectionDetailView',
  components: {
    ItemForm,
    PCForm,
  },
  data(){
    return {
      showEdit: false,
      showItems: false,
      showPCs: false,
      showEditionWindow: true,
      allowDeletion: false,
      collection: {},
      id: null,
      showItemForm: true,
      itemList: [
        {id: "1", name: "item1", type: null, data_pc: "test pc data"},
        {id: "2", name: "item2", type: null, data_gm: "test gm data"}],
      itemToEdit: {},
      itemModifiedList: [],
      pcList: [],
    }
  },
  beforeMount(){
    this.id = this.$route.params.id
    this.getCollectionDetail()
  },
  methods: {
    modifiedItem(id) {
      console.log('modified item: ', id)
      this.itemModifiedList.push({id: id, action: update})
    },
    editItem(item) {
      this.showItemForm = true
      this.itemToEdit = item
      console.log(this.itemToEdit.name)
    },
    createItem() {
      this.itemList.push({id: null, name: "New Item"})
    },
    createPC() {
      console.log('create pc')
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
        this.collection = response.data
        console.log(this.collection)
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

.center-elems {
  margin: 4px;
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
</style>