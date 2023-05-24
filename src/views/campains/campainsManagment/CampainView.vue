<template>
<div>
  <div class="columns">
    <div class="column is-9">
      {{ campain }}
      <br>



    </div>
    <div class="column is-3">
      <CampainTools :campain="campain" />

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
      }
  },
  beforeMount() {
    this.campain = this.$store.current_campain;
    this.table = this.$store.state.current_table;
  },
  methods: {
  }

}
</script>

<style>

</style>