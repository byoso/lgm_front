<template>
  <div class="container">
    <h1 class="title">Table '{{ table.name }}'</h1>
    <div v-if="is_owner">
      <a class="button is-small is-warning m-2" @click="editTable(table.id)">Edit {{ table.name }}</a>
      <a class="button is-small is-success m-2" @click="newCampain">+ new campain</a>
    </div>
    <hr>

    <h2 class="subtitle">Members</h2>
    <table class="table is-striped is-fullwidth m-2 is-bordered is-narrow">
      <thead>
        <tr>
          <th>owners</th>
          <th>guests</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <ul>
              <li v-for="owner in table.owners" :key="owner.id"  class="mt-2">
                {{ owner.username }}
                <fa v-if="is_owner & table.owners.length > 1" icon="arrow-right" class="arrow is-pulled-right ml-2"
                @click="switchGuestOwner(owner.id)"/>
              </li>
            </ul>
          </td>
          <td>
            <ul>
              <li v-for="guest in table.guests" :key="guest.id"  class="mt-2">
                <fa v-if="is_owner" icon="arrow-left" class="arrow is-pulled-left mr-2"
                @click="switchGuestOwner(guest.id)"/>
                {{ guest.email }} - {{ guest.username }}
              </li>
            </ul>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="campains.length" class="container-campain">
        <CampainBox v-for="campain in campains" :key="campain.id" :campain="campain"/>
    </div>

  </div>
</template>

<script>
import axios from 'axios';
import CampainBox from '../components/CampainBox.vue';

export default {
  name: "TableView",
  components: {
    CampainBox,
  },
  data() {
    return {
      table: {name: "no name"},
      campains: [],
      is_owner: false,
    }
  },
  beforeMount() {
    this.table = this.$store.state.current_table;
    if (this.table.owners.some(e => e.id === this.$store.user.id) & this.$store.user.is_subscriber) {
      this.is_owner = true;
    }
    axios({
      method: 'get',
      url: 'campains/get_campains_for_table/',
      params: {
        table_id: this.table.id,
      },
      headers: {
        'Authorization': `Token ${this.$store.state.token}`
      }
    })
    .then(response => {
      this.campains = response.data;
      console.log(this.campains)
    })
    .catch(error => {
      console.log(error)
    })
  },
  methods: {
    editTable(id) {
      this.$router.push({ name: 'edit_table', params: { id: id } });
    },
    newCampain() {
      this.$router.push({name: 'NewCampainView'});
    },
    switchGuestOwner(id) {
      axios(
        {
          method: 'POST',
          url: 'campains/switch_guest_owner/',
          data: {
            table_id: this.table.id,
            user_id: id,
          },
          headers: {
            'Authorization': `Token ${this.$store.state.token}`
          }
        }
      ).then(response => {
        this.table = response.data.table;
        this.$store.current_table = response.data.table;
        if (this.table.owners.some(e => e.id === this.$store.user.id) & this.$store.user.is_subscriber) {
          this.is_owner = true;
        } else {
          this.is_owner = false;
        }
      }).catch(error => {
        console.log(error)
      }
      )
    },
  }
}
</script>

<style scoped>

.arrow {
  color: darkseagreen;
}

.arrow:hover {
  color: lightseagreen;
  cursor: pointer;
}

table, td, th {
  border: 1px solid #DDD;
  text-align:center;
  width:50%;
  padding:5px;
}
th
{
  width:50%;
}

.container-campain {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  flex-wrap: wrap;
  min-height: 600px;
}

</style>
