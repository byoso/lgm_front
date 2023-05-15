<template>
  <div>
    <h1 class="title">Table '{{ table.name }}'</h1>

    <a class="button is-success" v-if="is_owner" @click="newCampain">+ new campain</a>

    <table class="table is-striped is-fullwidth m-2 is-bordered is-narrow">
      <caption class="subtitle">Members</caption>
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

  </div>
</template>

<script>
import axios from 'axios';



export default {
  name: "TableView",
  data() {
    return {
      table: {name: "no name"},
      is_owner: false,
    }
  },
  beforeMount() {
    this.table = this.$store.state.current_table;
    if (this.table.owners.some(e => e.id === this.$store.user.id) & this.$store.user.is_subscriber) {
      this.is_owner = true;
    }
  },
  methods: {
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

</style>
