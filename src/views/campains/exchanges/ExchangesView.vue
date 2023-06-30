<template>
<div class="container">
  <h1 class="title">Exchanges</h1>
  <!-- column A -->
  <div class="columns">
    <div class="column">
      <select class="select is-fullwidth" v-if="campainASelected === null" v-model="campainASelected" @change="getCampainA(campainASelected)">
        <option selected hidden value="null">Choose a campain</option>
        <option v-for="campain in campains" :value="campain" :key="campain.id">
          <span>
            [{{campain.game}}]
            <span v-if="!campain.is_copy_free"> [copy locked !] </span>
            {{campain.title}}
          </span>
        </option>
      </select>
      <div v-if="campainASelected !== null">
        <h2 class="subtitle">{{ campainASelected.title }}
          <span class="is-pulled-right">
            <button class="button is-small is-success mr-2" @click="applyExchanges" v-if="exportsList.length">
              Apply exchanges
            </button>
            <button class="button is-small" @click="cancel">Cancel</button>

          </span>
        </h2>

        <span v-if="campainASelected.is_copy_free"><fa icon="unlock" style="color: green;"/> Exports allowed</span>
        <span v-else><fa icon="lock" style="color: red;"/> Exports locked (copy protected collection)</span>

      </div>

    <table class="table is-fullwidth" v-if="campainASelected !== null">
      <thead>
        <th>Name</th>
        <th>Type</th>
        <th v-if="campainASelected.is_copy_free">Copy to <fa icon="arrow-right"/></th>
      </thead>
      <tbody>
        <tr v-for="item in campainA.items" :key="item.id" class="hoverable"
          @click="toExportsList(campainASelected, 'item', item.id, typeB, campainBSelected)">
          <td>{{ item.name.slice(0, 25) }}</td>
          <td :class="item.type">{{ item.type }}</td>
          <td v-if="campainASelected.is_copy_free">
            <fa v-if="checked(item.id)" icon="arrow-right" style="color: #8a9df3;" class="is-pulled-right" />
          </td>
        </tr>
      </tbody>

    </table>

    <table class="table is-fullwidth" v-if="campainASelected !== null">
      <thead>
        <th>Name</th>
        <th v-if="campainASelected.is_copy_free">Copy to <fa icon="arrow-right"/></th>
      </thead>
      <tbody>
        <tr v-for="pc in campainA.campain_pcs" :key="pc.id" class="hoverable"
        @click="toExportsList(campainASelected, 'pc', pc.id, typeB, campainBSelected)">
          <td>{{ pc.name.slice(0, 25) }}</td>
          <td v-if="campainASelected.is_copy_free">
            <fa v-if="checked(pc.id)" icon="arrow-right" style="color: #8a9df3;" class="is-pulled-right" />
          </td>
        </tr>
      </tbody>
    </table>

    </div>

    <!-- column B -->
    <div class="column">
      <label class="label" v-if="(campainBSelected === null) & (campainASelected !== null)">
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

          <select class="select" v-if="typeB === 'campain'" v-model="campainBSelected" @change="getCampainB(campainBSelected)">
            <option selected hidden value="null">Choose a campain</option>
            <option v-for="campain in campainsAvailableInB" :value="campain" :key="campain.id">
              <span>
                [{{campain.game}}]
                <span v-if="!campain.is_copy_free"> [copy locked !] </span>
                {{campain.title}}
              </span>
            </option>
          </select>

        </div>
      </label>
      <div v-if="campainBSelected !== null">
        <h2 class="subtitle">{{ campainBSelected.title }}
        </h2>
        <span v-if="campainBSelected.is_copy_free"><fa icon="unlock" style="color: green;"/> Exports allowed</span>
        <span v-else><fa icon="lock" style="color: red;"/> Exports locked (copy protected collection)</span>

      </div>

      <div>

        <table class="table is-fullwidth" v-if="campainBSelected !== null">
          <thead>
            <th v-if="campainBSelected.is_copy_free"><fa icon="arrow-left"/> Copy to</th>
            <th>Type</th>
            <th>Name</th>
          </thead>
          <tbody>
            <tr v-for="item in campainB.items" :key="item.id" class="hoverable"
              @click="toExportsList(campainBSelected, 'item', item.id, typeA, campainASelected)">
              <td v-if="campainBSelected.is_copy_free"><fa v-if="checked(item.id)" icon="arrow-left" style="color: #8a9df3;"/></td>
              <td :class="item.type">{{ item.type }}</td>
              <td>{{ item.name.slice(0, 25) }}</td>

            </tr>
          </tbody>

        </table>

        <table class="table is-fullwidth" v-if="campainBSelected !== null">
          <thead>

            <th v-if="campainASelected.is_copy_free"><fa icon="arrow-left"/> Copy to</th>
            <th>Name</th>
          </thead>
          <tbody>
            <tr v-for="pc in campainB.campain_pcs" :key="pc.id" class="hoverable"
            @click="toExportsList(campainBSelected, 'pc', pc.id, typeA, campainASelected)">
              <td v-if="campainBSelected.is_copy_free"><fa v-if="checked(pc.id)" icon="arrow-left" style="color: #8a9df3;"/></td>
              <td>{{ pc.name.slice(0, 25) }}</td>
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
      campainASelected: null,
      campainBSelected: null,
      campainA: [],
      campainB: [],
      exportsList: [],
      sourceA: {},
      typeB: 'campain',
      sourceB: {},
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
      console.log(this.campains)
    }).catch(error => {
      console.log(error)
    })
  },
  computed: {
    campainsAvailableInB(){
      if (this.campainASelected === null) {
        return []
      }
      return this.campains.filter(campain => campain.id !== this.campainASelected.id)
    },
  },
  methods: {
    applyExchanges(){
      console.log("apply exchanges... (TODO)")
    },
    toExportsList(export_from, type, id, export_to_type, export_to){
      if (this.campainBSelected === null){
        console.log("campainSelectedB: ", this.campainBSelected)
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
      if (this.exportsList.filter(obj => obj.id === id).length) {
        let index = this.exportsList.findIndex(obj => obj.id === id)
        this.exportsList.splice(index, 1)
        console.log("exportsList", this.exportsList)
        return
      }
      if (!export_from.is_copy_free){
        return
      }
      this.exportsList.push({
        type: type,
        id: id,
        to_type: export_to_type,
        to: export_to.id,
      })
      console.log("exportsList", this.exportsList)
    },
    checked(id){
      if (this.exportsList.filter(obj => obj.id === id).length) {
        return true
      }
      return false
    },
    checkA(type, id) {
      console.log("campainASelected: ,", this.campainASelected)
      if (!this.sourceB.length < 1){
        // TODO: toast
        return
      } else if (!this.campainASelected.is_copy_free){
        return
      } else {
        this.exportsList.push({
          type: type,
          id: id,
          to: sourceB.id
        })
      }
    },
    getCampainA(campain) {
      if (this.campainASelected === null) {
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
        this.campainA = response.data;
        console.log(this.campainA)
      }).catch(error => {
        console.log(error)
      })
    },
    cancel() {
      this.campainASelected = null
      this.campainBSelected = null
      this.campainA = []
      this.campainB = []
      this.exportsList = []
    },
    getCampainB(campain) {
      if (this.campainBSelected === null) {
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
        this.campainB = response.data;
        console.log(this.campainB)
      }).catch(error => {
        console.log(error)
      })

    },
  },
}
</script>


<style>

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