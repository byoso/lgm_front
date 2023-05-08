<template>
<div>
  <h1 class="title">Dashboard - {{ user }}</h1>


<br>
  <router-link to="/create_table" class="button is-success m-2">+ new table</router-link>
  <br>
  My tables as owner:
  <table class="table is-bordered is-fullwidth">
    <thead>
      <tr>
        <th>name</th>
        <th>guests</th>
        <th>Guests's password</th>
        <th>Edit</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="table in tables_as_owner" :key="table.id">
        <td class="clickable" @click="selectTable(table.id)"><a>{{ table.name }}</a></td>
        <td>
          <ul>
            <li v-for="guest in table.guests" :key="guest.id">
              - {{ guest.email }} - {{ guest.username }}
            </li>
          </ul>
        </td>
        <td>{{ table.table_password }}</td>
        <td><span class="button is-warning is-small" @click="editTable(table.id)">Edit</span></td>
      </tr>
    </tbody>
  </table>
<br>

  My tables as guest:
  <ul>
    <li v-for="table in tables_as_guest" :key="table.id">
      - {{ table.name }}
    </li>
  </ul>



</div>

</template>

<script>
import axios from 'axios';

export default {
  name: 'DashBoardView',
  components: {
  },
  data() {
    return {
      user: "",
      tables_as_owner: [],
      tables_as_guest: [],

    };
  },
  beforeMount() {
    this.user =  this.$store.username;
    axios(
      {
        method: 'get',
        url: '/campains/dashboard/',
        headers: {
          'Authorization': `Token ${this.$store.state.token}`
        }
      }
    ).then(response => {
      this.tables_as_owner = response.data['tables_as_owner'];
    }).catch(error => {
      console.log(error);
    });
  },
  methods: {
    selectTable(id) {
      console.log('selectTable', id);
    },
    editTable(id) {
      console.log("ediTable", id)
      this.$router.push({ name: 'edit_table', params: { id: id } });
    }
  }
}
</script>

<style>

.clickable {
  cursor: pointer;
}

</style>