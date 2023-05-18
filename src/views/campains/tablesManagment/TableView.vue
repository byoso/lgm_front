<template>
  <div>
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

    <div v-if="campains.length">
      <h2 class="subtitle">Campains</h2>
      <div class="container-campain">
        <div v-for="campain in campains" class="box m-2 is-half campain"
         :key="campain.id" @click="gotoCampain(campain.id)">
          <h2 class="subtitle">{{ campain.title }}</h2>
          <figure class="image is-128x128 is-pulled-right">
            <img src="https://bulma.io/images/placeholders/128x128.png">
          </figure>
          <ul>
            <li>game: {{ campain.game.name }}</li>
            <li>game master: {{ campain.game_master.character_name }}</li>
            <li>description: {{ campain.description }}</li>
            <li>is ended ? : {{ campain.is_ended }}</li>
            <ul>
              <li v-for="pc in campain.campain_pcs">- {{pc.user.username}} as {{ pc.character_name }}</li>
            </ul>

          </ul>

        </div>

      </div>
    </div>

  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: "TableView",
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
    gotoCampain(id) {
      this.$store.current_campain = this.campains.find(campain => campain.id === id);
      this.$router.push({ name: 'CampainView', params: { id: id } });
    },
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
}

.campain {
  background-color: #f5f5f5;
  padding: 10px;
  border: 1px solid #DDD;
  border-radius: 10px;
  text-align:left;
  width:40%;
}
.campain:hover {
  border: 1px solid lightseagreen;
  cursor: pointer;
  transform: scale(1.05);
  transition: all 0.1s ease-in-out;
}

</style>
