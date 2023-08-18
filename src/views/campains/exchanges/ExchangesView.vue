<template>
<div class="container is-hidden-mobile">
  <h1 class="title">Exchanges</h1>
  <!-- column A -->
  <div class="columns">
    <div class="column">
      <div v-if="columnASelected === null">
        Please select:
        <label class="radio m-2">
          <input type="radio" name="answer" v-model="typeA" value="campain">
          a Campain
        </label>
        <label class="radio m-2">
          <input type="radio" name="answer" v-model="typeA" value="collection">
          a Collection
        </label>

        <!-- column A: select a campain -->
        <select class="select is-fullwidth" v-if="typeA === 'campain'" v-model="columnASelected" @change="getCampainA(columnASelected)">
          <option selected hidden value="null">Choose a campain</option>
          <option v-for="campain in campains" :value="campain" :key="campain.id">
            <span>
              [{{charLimit(campain.table)}}]
              [{{charLimit(campain.game)}}]
              <span v-if="!campain.is_copy_free"> [copy restricted] </span>
              {{charLimit(campain.title)}}
            </span>
          </option>
        </select>

        <!-- column A: select a collection -->
        <select class="select is-fullwidth" v-if="typeA === 'collection'" v-model="columnASelected" @change="getCollectionA(columnASelected)">
          <option selected hidden value="null">Choose a collection</option>
          <option value="" disabled>--- My collections ---</option>
          <option v-for="collection in collections" :value="collection" :key="collection.id">
            <span>
              [{{charLimit(collection.game)}}]
              <span v-if="!collection.is_copy_free"> [copy restricted] </span>
              {{charLimit(collection.title)}}
            </span>
          </option>
          <option value="" disabled>--- Favorites ---</option>
          <option v-for="favorite in favorites" :value="favorite" :key="favorite.id">
            <span>
              [{{charLimit(favorite.game)}}]
              <span v-if="!favorite.is_copy_free"> [copy restricted] </span>
              {{charLimit(favorite.title)}}
            </span>
          </option>
        </select>
      </div>


      <div v-if="columnASelected !== null">
        <h2 class="subtitle">
          {{ charLimit(columnASelected.title) }}
          ({{typeA}}<span v-if="typeA==='campain'"> for {{columnASelected.table}}</span>)
          <span class="is-pulled-right">
            <button class="button is-small is-success mr-2" @click="applyExchanges" v-if="showApplyExchanges">
              Apply exchanges
            </button>
            <button class="button is-small" @click="cancel">Cancel</button>

          </span>
        </h2>

        <span v-if="!aIsLocked"><fa icon="unlock" style="color: green;"/> Free exports</span>
        <span v-else><fa icon="lock" style="color: red;"/> Exports restricted (copy protected)</span>

      </div>
    <div class="scrollable">
      <table class="table is-fullwidth" v-if="columnASelected !== null">
        <thead>
          <th>Name</th>
          <th>Type</th>
          <th v-if="!aIsLocked">Copy to <fa icon="arrow-right"/></th>
        </thead>
        <tbody>
          <tr v-for="item in campainA.items" :key="item.id" class="hoverable"
            @click="addToExchanges('from_a', 'items', item.id)">
            <td>{{ charLimit(item.name) }}</td>
            <td :class="item.type">{{ item.type }}</td>
            <td v-if="!aIsLocked">
              <fa v-if="checked('from_a', 'items', item.id)" icon="arrow-right" style="color: #8a9df3;" class="is-pulled-right" />
            </td>
          </tr>
        </tbody>

      </table>

      <table class="table is-fullwidth" v-if="columnASelected !== null">
        <thead>
          <th>Name</th>
          <th v-if="!aIsLocked">Copy to <fa icon="arrow-right"/></th>
        </thead>
        <tbody>
          <tr v-for="pc in campainA.pcs" :key="pc.id" class="hoverable"
          @click="addToExchanges('from_a', 'pcs', pc.id)">
            <td>{{ charLimit(pc.name) }}</td>
            <td v-if="!aIsLocked">
              <fa v-if="checked('from_a', 'pcs', pc.id)" icon="arrow-right" style="color: #8a9df3;" class="is-pulled-right" />
            </td>
          </tr>
        </tbody>
      </table>

    </div>


    </div>

    <!-- column B -->
    <div class="column">
      <label class="label" v-if="(columnBSelected === null) & (columnASelected !== null)">
        Exchange with:
        <div class="control">
          <label class="radio m-2">
            <input type="radio" name="answer" v-model="typeB" value="campain">
            a Campain
          </label>
          <label class="radio m-2">
            <input type="radio" name="answer" v-model="typeB" value="collection">
            a Collection
          </label>

          <select class="select is-fullwidth" v-if="typeB === 'campain'" v-model="columnBSelected" @change="getCampainB(columnBSelected)">
            <option selected hidden value="null">Choose a campain</option>
            <option v-for="campain in campainsAvailableInB" :value="campain" :key="campain.id">
              <span>
                [{{charLimit(campain.table)}}]
                [{{charLimit(campain.game)}}]
                <span v-if="!campain.is_copy_free"> [copy restricted] </span>
                {{charLimit(campain.title)}}
              </span>
            </option>
          </select>

          <!-- column B: select a collection -->
          <select class="select is-fullwidth" v-if="typeB === 'collection'"
            v-model="columnBSelected" @change="getCollectionB(columnBSelected)">
            <option selected hidden value="null">Choose a collection</option>
            <option value="" disabled>--- My collections ---</option>
            <option v-for="collection in collectionsAvailableInB" :value="collection" :key="collection.id">
              <span>
                [{{charLimit(collection.game)}}]
                <span v-if="!collection.is_copy_free"> [copy restricted] </span>
                {{charLimit(collection.title)}}
              </span>
            </option>
            <option value="" disabled>--- Favorites ---</option>
            <option v-for="favorite in favorites" :value="favorite" :key="favorite.id">
              <span>
                [{{charLimit(favorite.game)}}]
                <span v-if="!favorite.is_copy_free"> [copy restricted] </span>
                {{charLimit(favorite.title)}}
              </span>
            </option>

          </select>


        </div>
      </label>
      <div v-if="columnBSelected !== null">
        <h2 class="subtitle">
          {{ charLimit(columnBSelected.title) }}
          ({{ typeB }}<span v-if="typeB==='campain'"> for {{columnBSelected.table}}</span>)
        </h2>
        <span v-if="!bIsLocked"><fa icon="unlock" style="color: green;"/> Free exports</span>
        <span v-else><fa icon="lock" style="color: red;"/> Exports restricted (copy protected)</span>

      </div>

      <div class="scrollable">

        <table class="table is-fullwidth" v-if="columnBSelected !== null">
          <thead>
            <th v-if="!bIsLocked"><fa icon="arrow-left"/> Copy to</th>
            <th>Type</th>
            <th>Name</th>
          </thead>
          <tbody>
            <tr v-for="item in campainB.items" :key="item.id" class="hoverable"
              @click="addToExchanges('from_b', 'items', item.id)">
              <td v-if="!bIsLocked"><fa v-if="checked('from_b', 'items', item.id)" icon="arrow-left" style="color: #8a9df3;"/></td>
              <td :class="item.type">{{ item.type }}</td>
              <td>{{ charLimit(item.name) }}</td>

            </tr>
          </tbody>

        </table>

        <table class="table is-fullwidth" v-if="columnBSelected !== null">
          <thead>

            <th v-if="!bIsLocked"><fa icon="arrow-left"/> Copy to</th>
            <th>Name</th>
          </thead>
          <tbody>
            <tr v-for="pc in campainB.pcs" :key="pc.id" class="hoverable"
            @click="addToExchanges('from_b', 'pcs', pc.id)">
              <td v-if="!bIsLocked"><fa v-if="checked('from_b', 'pcs', pc.id)" icon="arrow-left" style="color: #8a9df3;"/></td>
              <td>{{ charLimit(pc.name) }}</td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  </div>
</div>
</template>

<script>
import axios from 'axios';
import { toast } from 'bulma-toast';

export default {
  name: 'ExchangesView',
  data(){
    return {
      campains: [],
      columnASelected: null,
      columnBSelected: null,
      campainA: [],
      aIsLocked: false,
      bIsLocked: false,
      campainB: [],
      collections: [],
      favorites: [],
      exchanges: {
        a_type: null,
        a_id: null,
        b_type: null,
        b_id: null,
        from_a: {
          items: [],
          pcs: [],
        },
        from_b: {
          items: [],
          pcs: [],
        }
      },
      // sourceA: {},
      // sourceB: {},
      typeA: 'campain',
      typeB: 'campain',
    }
  },
  beforeMount() {
    axios({
      method: 'get',
      url: '/campains/exchanges_loading/',
      headers: {
        'Authorization': `Token ${this.$store.state.token}`
      },
    }).then(response => {
      this.campains = response.data.campains;
      this.collections = response.data.collections;
      this.favorites = response.data.favorites;
    }).catch(error => {
      console.log(error)
    })
  },
  computed: {
    showApplyExchanges() {
      return this.exchanges.from_a.items.length > 0 ||
      this.exchanges.from_a.pcs.length > 0 ||
      this.exchanges.from_b.items.length > 0 ||
      this.exchanges.from_b.pcs.length > 0
    },
    collectionsAvailableInB(){
      if (this.columnASelected === null) {
        return []
      }
      return this.collections.filter(collection => collection.id !== this.columnASelected.id)
    },
    campainsAvailableInB(){
      if (this.columnASelected === null) {
        return []
      }
      return this.campains.filter(campain => campain.id !== this.columnASelected.id)
    },
  },
  methods: {
    applyExchanges(){
      this.exchanges.a_type = this.typeA
      this.exchanges.b_type = this.typeB
      this.exchanges.a_id = this.columnASelected.id
      this.exchanges.b_id = this.columnBSelected.id
      axios({
        method: 'post',
        url: '/campains/apply_exchanges/',
        headers: {
          'Authorization': `Token ${this.$store.state.token}`
        },
        data: {
          exchanges: this.exchanges,
        }
      }).then(response => {
        this.campainA = response.data.source_a
        this.campainB = response.data.source_b

        toast({
          message: 'Exchanges applied',
          type: 'is-success',
          position: 'bottom-right',
          dismissible: true,
          pauseOnHover: true,
          duration: 3000,
        });
        this.exchanges.from_a.items = []
        this.exchanges.from_a.pcs = []
        this.exchanges.from_b.items = []
        this.exchanges.from_b.pcs = []
      }).catch(error => {
        console.log(error)
      })

    },
    setLocks(){
      console.log("column A: ", this.columnASelected)
      console.log("column B: ", this.columnBSelected)
      // collection to collection
      if ((this.typeA === this.typeB) & this.typeA === 'collection') {
        console.log("collection to collection")
        if (this.columnBSelected.is_copy_free & (this.columnASelected.author === this.$store.state.user.id)){
          this.aIsLocked = true
          this.bIsLocked = false
        } else if (this.columnASelected.is_copy_free & (this.columnBSelected.author === this.$store.state.user.id)) {
          this.aIsLocked = false
          this.bIsLocked = true
        } else {
          this.aIsLocked = true
          this.bIsLocked = true
        }
        if ((this.columnASelected.author === this.columnBSelected.author)
             & this.columnASelected.author === this.$store.state.user.id) {
          this.aIsLocked = false
          this.bIsLocked = false
        }
      }
      // campain to campain
      if (this.typeA === 'campain'){
        if (this.typeB === 'campain'){
          console.log('campain to campain')
          if (this.columnASelected.is_copy_free === this.columnBSelected.is_copy_free){
            console.log('both locked or both unlocked')
            this.aIsLocked = false
            this.bIsLocked = false
          } else {
            if (!this.columnASelected.is_copy_free){
              this.aIsLocked = true
              this.bIsLocked = false
            } else {
              this.aIsLocked = false
              this.bIsLocked = true
            }
          }
        }
        if (this.typeB === 'collection'){
          if (!this.columnASelected.is_copy_free) {
            this.aIsLocked = true
            this.bIsLocked = false
          }
          if (this.columnASelected.is_copy_free) {
            if (!this.columnBSelected.is_copy_free) {
              this.aIsLocked = true
              this.bIsLocked = true
            }
            if (this.columnBSelected.is_copy_free) {
              this.aIsLocked = true
              this.bIsLocked = false
            }
            if (this.columnBSelected.author === this.$store.state.user.id) {
              this.aIsLocked = false
              this.bIsLocked = false
            }
          }
        }
      }

      // campain to collection
      if (this.typeA === 'campain' & this.typeB === 'collection'){
        if (!this.columnASelected.is_copy_free) {
          this.aIsLocked = true
          this.bIsLocked = false
        }
        if (this.columnASelected.is_copy_free) {
          if (!this.columnBSelected.is_copy_free) {
            this.aIsLocked = true
            this.bIsLocked = true
            if (this.columnBSelected.author === this.$store.state.user.id) {
              this.aIsLocked = false
              this.bIsLocked = false
            }
          }
          if (this.columnBSelected.is_copy_free) {
            this.aIsLocked = true
            this.bIsLocked = false
            if (this.columnBSelected.author === this.$store.state.user.id) {
              this.aIsLocked = false
              this.bIsLocked = false
            }
          }
        }
      }
      // collection to campain
      if (this.typeA === 'collection' & this.typeB === 'campain'){
        if (!this.columnBSelected.is_copy_free) {
          this.aIsLocked = false
          this.bIsLocked = true
        }
        if (this.columnBSelected.is_copy_free) {
          if (!this.columnASelected.is_copy_free) {
            this.aIsLocked = true
            this.bIsLocked = true
            if (this.columnASelected.author === this.$store.state.user.id) {
              this.aIsLocked = false
              this.bIsLocked = false
            }
          }
          if (this.columnASelected.is_copy_free) {
            this.aIsLocked = false
            this.bIsLocked = true
            if (this.columnASelected.author === this.$store.state.user.id) {
              this.aIsLocked = false
              this.bIsLocked = false
            }
          }
        }
      }
    },
    charLimit(text) {
      if (text.length <= 25) {
        return text;
      }
      return text.slice(0, 22) + '...';
    },
    addToExchanges(from, type, id) {
      if ((from === 'from_a') & (this.aIsLocked)){
        return
      }
      if ((from === 'from_b') & (this.bIsLocked)){
        return
      }
      if (this.columnBSelected === null){
        console.log("campainSelectedB: ", this.columnBSelected)
        toast({
          message: 'Please select a campain or a collection to exchange with',
          type: 'is-warning',
          position: 'center',
          dismissible: true,
          pauseOnHover: true,
          duration: 10000,
        });
        return
      }
      if (this.exchanges[from][type].filter(obj => obj === id).length) {
        let index = this.exchanges[from][type].findIndex(obj => obj === id)
        this.exchanges[from][type].splice(index, 1)
        console.log("exchanges", this.exchanges)
        return
      }
      this.exchanges[from][type].push(id)
    },
    checked(from, type, id){
      if (this.exchanges[from][type].filter(elem => elem === id).length) {
        return true
      }
      return false
    },
    getCollectionA(collection) {
      this.aIsLocked = !collection.is_copy_free
      if (this.columnASelected === null) {
        return
      }
      console.log('get datas for : ', collection.title)
      axios({
        url: `/campains/collection/`,
        method: 'get',
        headers: {
          'Authorization': `Token ${this.$store.state.token}`
        },
        params: {
          id: collection.id,
        }
      }).then(response => {
        this.campainA = response.data;
        console.log(this.campainA)
      }).catch(error => {
        console.log(error)
      })
    },
    getCollectionB(collection){
      this.bIsLocked = !collection.is_copy_free
      if (this.columnBSelected === null) {
        return
      }
      console.log('get datas for : ', collection.title)
      axios({
        url: `/campains/collection/`,
        method: 'get',
        headers: {
          'Authorization': `Token ${this.$store.state.token}`
        },
        params: {
          id: collection.id,
        }
      }).then(response => {
        this.campainB = response.data;
        console.log(this.campainB)
        this.setLocks()
      }).catch(error => {
        console.log(error)
      })
    },
    getCampainA(campain) {
      this.aIsLocked = !campain.is_copy_free
      if (this.columnASelected === null) {
        return
      }
      console.log('get datas for : ', campain.title)
      axios({
        method: 'get',
        url: `/campains/campains/${campain.id}/`,
        headers: {
          'Authorization': `Token ${this.$store.state.token}`
        },
      }).then(response => {
        this.campainA = response.data.campain;
        console.log(this.campainA)
      }).catch(error => {
        console.log(error)
      })
    },
    cancel() {
      this.columnASelected = null
      this.columnBSelected = null
      this.campainA = []
      this.campainB = []
      this.exportsList = []
    },
    getCampainB(campain) {
      if (this.columnBSelected === null) {
        return
      }
      console.log('get datas for : ', campain.title)
      axios({
        method: 'get',
        url: `/campains/campains/${campain.id}/`,
        headers: {
          'Authorization': `Token ${this.$store.state.token}`
        },
      }).then(response => {
        this.campainB = response.data.campain;
        this.setLocks()
        console.log(this.campainB)
      }).catch(error => {
        console.log(error)
      })
    },
  },
}
</script>


<style scoped>

.scrollable {
  height: 70vh;
  overflow-y: auto;
  position: relative;
}

.hoverable:hover {
  background-color: rgb(176, 255, 210);
  color: rgb(92, 92, 92);
  cursor: pointer;
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