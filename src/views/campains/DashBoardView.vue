<template>
<div>
  <h1 class="title">Dashboard - {{ user.username }}</h1>


<br>
  <router-link to="/create_table" class="button is-success m-2">+ new table</router-link>
  <br>
  <div v-if="tables_as_owner.length">
    <h2 class="subtitle">My tables as owner:</h2>
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
          <td><router-link @click="storeTable(table)" :to="{name: 'table', params: {id: table.id} }">{{ table.name }}</router-link></td>
          <td>
            <ul>
              <li v-for="guest in table.guests" :key="guest.id">
                {{ guest.email }} - {{ guest.username }}
              </li>
            </ul>
          </td>
          <td>{{ table.table_password }}</td>
          <td><span class="button is-warning is-small" @click="editTable(table.id)">Edit</span></td>
        </tr>
      </tbody>
    </table>

  </div>
<br>
  <div v-if="tables_as_guest.length">
    <h2 class="subtitle">My tables as guest:</h2>
    <table class="table is-bordered is-fullwidth">
      <thead>
        <tr>
          <th>name</th>
          <th>guests</th>
          <th>owners</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="table in tables_as_guest" :key="table.id">
          <td><router-link :to="{name: 'table', params: {id: table.id} }" @click="storeTable(table)">{{ table.name }}</router-link></td>
          <td>
            <ul>
              <li v-for="guest in table.guests" :key="guest.id">
                {{ guest.email }} - {{ guest.username }}
              </li>
            </ul>
          </td>
          <td>
            <ul>
              <li v-for="owner in table.owners" :key="owner.id">{{ owner.username }}</li>
            </ul>

          </td>
        </tr>
      </tbody>
    </table>
  </div>



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
    this.user =  this.$store.user;
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
      this.tables_as_guest = response.data['tables_as_guest'];
    }).catch(error => {
      console.log(error);
    });

  },
  methods: {
    storeTable(table) {
      this.$store.state.current_table = table;
    },
    editTable(id) {
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