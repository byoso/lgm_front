<template>
<div>
  <h1 class="title">Campain books</h1>

<h2>User: {{ user.name }}</h2>
<br>
  <router-link to="/create_table" class="button is-success m-2">+ new table</router-link>
  <br>
  My tables:
  <ul>
    <li v-for="table in tables" :key="table.id">
      - {{ table.name }}
    </li>
  </ul>
<br>
  My campains:
  <ul>
    <li v-for="campain in campains" :key="campain.id">
      - {{ campain.title }}
    </li>
  </ul>



</div>

</template>

<script>
import axios from 'axios';

export default {
  name: 'NotebooksView',
  components: {
  },
  data() {
    return {
      user: {},
      tables: [],
      campains: [],

    };
  },
  beforeMount() {
  },
}
</script>

<style>

</style>