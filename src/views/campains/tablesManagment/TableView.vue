<template>
  <div class="container">
    <h1 class="subtitle">Table {{ table.name }}
    </h1>
    <div v-if="is_owner & is_subscriber">
      <a class="button is-small is-warning m-2" @click="editTable(table.id)">Edit {{ table.name }}</a>
      <a class="button is-small is-success m-2" @click="newCampain">+ new campain</a>
    </div>

    <div @click="showMembers = !showMembers" class="topic">Members
      <div class="is-pulled-right mr-2">
        <fa v-if="showMembers" icon="angle-down"/>
        <fa v-if="!showMembers" icon="angle-right"/>
      </div>
    </div>
    <div v-if="showMembers" >
      <div class="m-2">
        <table class="table is-striped is-fullwidth m-2 is-bordered is-narrow is-rounded">
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
                    <fa v-if="is_owner & table.owners.length > 1 & user.id != owner.id" icon="arrow-right" class="arrow is-pulled-right ml-2"
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
    </div>


    <div @click="showEndedCampains = !showEndedCampains" class="topic">Ended Campains
      <div class="is-pulled-right mr-2">
        <fa v-if="showEndedCampains" icon="angle-down"/>
        <fa v-if="!showEndedCampains" icon="angle-right"/>
      </div>
    </div>
    <div v-if="showEndedCampains" >
      <div class="m-2">
        <div v-if="campains.length" class="container-campain">
            <CampainBox v-for="campain in endedCampains" :key="campain.id" :campain="campain" class="is-2"/>
        </div>
      </div>
    </div>

    <div @click="showCampains = !showCampains" class="topic">Campains
      <div class="is-pulled-right mr-2">
        <fa v-if="showCampains" icon="angle-down"/>
        <fa v-if="!showCampains" icon="angle-right"/>
      </div>
    </div>
    <div v-if="showCampains" >
      <div class="m-2">
        <div v-if="campains.length" class="container-campain">
            <CampainBox v-for="campain in campains" :key="campain.id" :campain="campain" class="is-2"/>
        </div>
      </div>
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
      table: {name: "no name",},
      allCampains: [],
      endedCampains: [],
      campains: [],
      user: this.$store.state.user,
      showMembers: false,
      showEndedCampains: false,
      showCampains: true,
    }
  },
  computed: {
    is_owner() {
      return (this.table.owners.some(owner => owner.id === this.$store.state.user.id))
    },
    is_subscriber() {
      return this.$store.state.user.is_subscriber
    },
  },
  beforeMount() {
    this.table = this.$store.state.current_table;

    // campains datas
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
      this.allCampains = response.data;
      this.endedCampains = this.allCampains.filter(campain => campain.is_ended);
      this.sortByGame(this.endedCampains)
      this.campains = this.allCampains.filter(campain => !campain.is_ended);
      this.sortByGame(this.campains)
    })
    .catch(error => {
      console.log("campains error: ", error)
    })

  },
  methods: {
    sortByGame(list) {
      list.sort((a, b) => (a.game > b.game) ? 1 : -1)
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
        this.$store.state.current_table = response.data.table;
        if (this.table.owners.some(e => e.id === this.$store.state.user.id) & this.$store.state.user.is_subscriber) {
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
  min-height: 300px;
}

.topic {
  background-color: lightseagreen;
  color: white;
  cursor: pointer;
  border: 1px solid rgb(106, 227, 221);
  border-radius: 5px;
}
.topic:hover {
  background-color: rgb(130, 234, 229);
  color: rgb(92, 92, 92);
}

.is-rounded {
  border-radius: 5px;
}

</style>
