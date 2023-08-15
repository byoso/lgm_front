<template>
<div class="container">
  <h1 class="title">Dashboard - {{ charLimit(user.username) }}</h1>


<br>
  <router-link
  v-if="$store.state.user.is_subscriber"
  to="/create_table" class="button is-success is-small m-2">
    + new table
  </router-link>
  <br>
  <div v-if="tables_as_owner.length">
    <h2 class="subtitle">My tables as owner:</h2>
    <table class="table is-bordered is-fullwidth">
      <thead>
        <tr>
          <th>name</th>
          <th class="is-hidden-mobile">owners</th>
          <th class="is-hidden-mobile">guests</th>
          <th>Edit</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="table in tables_as_owner" :key="table.id">
          <td>
            <router-link @click="storeTable(table)" :to="{name: 'table', params: {id: table.id} }"
            class="button">
              {{ charLimit(table.name) }}
            </router-link>
          </td>

          <td class="is-hidden-mobile">
            <ul>
              <li v-for="owner in table.owners" :key="owner.id">
                {{ charLimit(owner.email) }} - {{ charLimit(owner.username) }}
              </li>
            </ul>
          </td>
          <td class="is-hidden-mobile">
            <ul>
              <li v-for="guest in table.guests.concat(table.game_masters)" :key="guest.id">
                {{ charLimit(guest.email) }} - {{ charLimit(guest.username) }}
              </li>
            </ul>
          </td>
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
          <th class="is-hidden-mobile">owners</th>
          <th class="is-hidden-mobile">guests</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="table in tables_as_guest" :key="table.id">
          <td>
            <router-link :to="{name: 'table', params: {id: table.id} }" @click="storeTable(table)"
            class="button">
              {{ charLimit(table.name) }}
            </router-link>
          </td>
          <td class="is-hidden-mobile">
            <ul>
              <li v-for="owner in table.owners" :key="owner.id">{{ charLimit(owner.username) }}</li>
            </ul>
          </td>
          <td class="is-hidden-mobile">
            <ul>
              <li v-for="guest in table.guests.concat(table.game_masters)" :key="guest.id">
                {{ charLimit(guest.email) }} - {{ charLimit(guest.username) }}
              </li>
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
    this.user =  this.$store.state.user;
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
      this.tables_as_gm = response.data['tables_as_gm'];
      this.tables_as_guest = this.tables_as_guest.concat(this.tables_as_gm);
    }).catch(error => {
      console.log(error);
    });

  },
  methods: {
    charLimit(text) {
      if (text.length <= 25) {
        return text;
      }
      return text.slice(0, 22) + '...';
    },
    storeTable(table) {
      this.$store.state.current_table = table;
    },
    editTable(id) {
      this.$router.push({ name: 'edit_table', params: { id: id } });
    }
  }
}
</script>

<style scoped>

.clickable {
  cursor: pointer;
}

</style>