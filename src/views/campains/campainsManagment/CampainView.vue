<template>
<div>
  <div class="columns">
    <div class="column is-9">
      {{ campain }}
      <br>

    </div>
    <div class="column is-3">
      <CampainTools class="campain-tools"
      :campain="campain" :refreshSpin="refreshSpin"
      @refreshCampain="refresh_campain"/>

    </div>
  </div>
</div>
</template>

<script>
import axios from 'axios';
import CampainTools from '../components/CampainTools.vue';


export default {
  name: 'CampainView',
  components: {
    CampainTools,
  },
  data() {
    return {
      campain: {title: "no title"},
      table: {},
      refreshSpin: false,
      }
  },
  beforeMount() {
    this.campain = this.$store.current_campain;
    this.table = this.$store.state.current_table;
  },
  methods: {
    refresh_campain() {
      this.refreshSpin = true;
      axios({
        method: 'get',
        url: `/campains/campains/${this.campain.id}/`,
        headers: {
          'Authorization': `Token ${this.$store.state.token}`
        }
      })
      .then(response => {
        this.campain = response.data;
        this.table = response.data.table;
        this.$store.state.current_campain = response.data;
        this.$store.state.current_table = response.data.table;
        console.log(this.campain.title)
        this.refreshSpin = false;
      })
      .catch(error => {
        console.log(error)
        this.refreshSpin = false;
      })
    },
  }

}
</script>

<style>
.campain-tools {
  padding: 10px;
  height: 90vh;
  overflow-y: auto;
  overflow-x: hidden;
}

</style>