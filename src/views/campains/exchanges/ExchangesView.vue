<template>
<div class="container">
  <h1 class="title">Exchanges</h1>
  <!-- column A -->
  <div class="columns">
    <div class="column">
      <select class="select" v-if="campainASelected === null" v-model="campainASelected" @change="getCampain(campainASelected)">
        <option selected hidden value="null">Choose a campain</option>
        <option v-for="campain in campains" :value="campain" :key="campain.id">
          [{{campain.game}}] {{campain.title}}
        </option>
      </select>
      <div v-if="campainASelected !== null">
        <h2 class="subtitle">{{ campainASelected.title }}<button class="button is-small is-pulled-right" @click="cancel">Cancel</button></h2>

        <span v-if="campainASelected.is_copy_free"><fa icon="unlock" style="color: green;"/> Exports allowed</span>
        <span v-else><fa icon="lock" style="color: red;"/> Exports locked (copy protected collection)</span>

      </div>

    <table class="table is-fullwidth" v-if="campainASelected !== null">
      <thead>
        <th>Name</th>
        <th>Type</th>
        <th v-if="campainASelected.is_copy_free">Copy to other</th>
      </thead>
      <tbody>
        <tr v-for="item in campainA.items" :key="item.id" class="hoverable"
          @click="toExports('item', item.id)">
          <td>{{ item.name.slice(0, 25) }}</td>
          <td :class="item.type">{{ item.type }}</td>
          <td v-if="campainASelected.is_copy_free"><fa v-if="checked(item.id)" icon="check" style="color: green;"/></td>
        </tr>
      </tbody>

    </table>

    <table class="table is-fullwidth" v-if="campainASelected !== null">
      <thead>
        <th>Name</th>
      </thead>
      <tbody>
        <tr v-for="pc in campainA.campain_pcs" :key="pc.id" class="hoverable">
          <td>{{ pc.name.slice(0, 25) }}</td>
        </tr>
      </tbody>
    </table>



    </div>

    <!-- column B -->
    <div class="column">
      B
    </div>
  </div>
</div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'ExchangesView',
  data(){
    return {
      campains: [],
      campainASelected: null,
      campainA: [],
      exports: [],
      sourceA: {},
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
  },
  methods: {
    toExports(type, id){
      console.log("exports", this.exports)
      if (this.exports.filter(obj => obj.id === id).length) {
        let index = this.exports.findIndex(obj => obj.id === id)
        this.exports.splice(index, 1)
        return
      }
      if (!this.campainASelected.is_copy_free){
        console.log("campainSelectedA: ", this.campainASelected)
        return
      }
      this.exports.push({
        type: type,
        id: id,
        // to_type: '' //'collection' or 'campain'
        // to: this.sourceB.id,
        to_type: "mock",
        to_id: "mock"
      })
      console.log("exports", this.exports)
    },
    checked(id){
      if (this.exports.filter(obj => obj.id === id).length) {
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
        this.exports.push({
          type: type,
          id: id,
          to: sourceB.id
        })
      }
    },
    getCampain(campain) {
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
      this.campainA = []
      this.exports = []
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