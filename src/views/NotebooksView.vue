<template>
  <h1 class="title">Campain books</h1>

<h2>User: {{ user.name }}</h2>
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
  beforeCreate() {
    axios.get('http://localhost:3000/campains')
        .then(response => {
        this.campains = response.data;
        })
        .catch(error => {
        console.log(error);
        });
    axios.get('http://localhost:3000/tables')
        .then(response => {
        this.tables = response.data;
        })
        .catch(error => {
        console.log(error);
        });
    axios.get('http://localhost:3000/users/1')
        .then(response => {
        this.user = response.data;
        })
        .catch(error => {
        console.log(error);
        });

  },

}
</script>

<style>

</style>