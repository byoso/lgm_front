<template>
  <div>
    <div @click="showInfo = !showInfo" class="topic">Campain infos
      <div class="is-pulled-right mr-2">
        <fa v-if="showInfo" icon="angle-down"/>
        <fa v-if="!showInfo" icon="angle-right"/>
      </div>
    </div>
    <div v-if="showInfo">
      <p>
        <p>
          <figure>
            <a v-if="campain.game.image_url" :href="campain.game.official_site" target="_blank">
              <img :src="campain.game.image_url">
            </a>
            <img v-else src="https://bulma.io/images/placeholders/128x128.png">
          </figure>

        </p>

        <h2 class="subtitle">{{ campain.title }} <br>
          <router-link :to="{name: 'table', params: {id: table.id} }"
          @click="gotoTable(table)">{{ table.name }}</router-link>
        </h2>
        <h3 class="subtitle">by {{ campain.game_master.character_name }}</h3>
      </p>
      <br>
      <div v-if="user.id === campain.game_master.user.id">
        <button class="button is-warning is-small"
        @click="allowDeleteCampain = !allowDeleteCampain">
        delete campain
        </button>
        <button  :disabled="!allowDeleteCampain"
        @click.prevent="deleteCampain(campain.id)"
        class="button is-danger is-small">Confirm deletion
        </button>
      </div>
      <hr>
    </div>

    <div @click="showPlayers = !showPlayers" class="topic">Players
      <div class="is-pulled-right mr-2">
        <fa v-if="showPlayers" icon="angle-down"/>
        <fa v-if="!showPlayers" icon="angle-right"/>
      </div>
    </div>
    <div v-if="showPlayers">
      <div v-for="player in campain.campain_pcs" :key="player.id" class="line-hoverable">
        {{ player.user.username }}
        <span class="is-pulled-right">{{ player.character_name }}
          <span v-if="player.user.id === campain.game_master.user.id">(GM)</span>
        </span>

      <div class="sep"></div>
      </div>
    </div>

    <div @click="showEventTools = !showEventTools" class="topic">
      <div class="is-pulled-right mr-2">
        <fa v-if="showEventTools" icon="angle-down"/>
        <fa v-if="!showEventTools" icon="angle-right"/>
      </div>
      Event tools
    </div>
    <div v-if="showEventTools">
      <button class="button is-small is-success m-2" @click="toggleCreateEventModal">+ New Event</button>
      <p>Search</p>
      <div class="field">
        <div class="control">
          <input class="input is-small" type="text" placeholder="Search by name">
        </div>
      </div>
      Filter...(TODO)

    </div>

    <CreateEventModal v-if="showCreateEventModal"
    :campain="campain" :showCreateEventModal="showCreateEventModal"
    :user="user"
    @closeCreateEventModal="toggleCreateEventModal"
    />

  </div>
</template>

<script>
import axios from 'axios';
import CreateEventModal from './CreateEventModal.vue';

export default {
  name: "CampainTools",
  components: {
    CreateEventModal,
  },
  props: [
    'campain',
  ],
  data() {
    return {
      table: {},
      user: {},
      showInfo: true,
      showEventTools: false,
      showPlayers: false,
      showCreateEventModal: false,
      allowDeleteCampain: false,
    }
  },
  beforeMount() {
    this.table = this.$store.state.current_table;
    this.user = this.$store.user;
    console.log("user is ", this.user)
  },
  methods: {
    toggleCreateEventModal(){
      this.showCreateEventModal = !this.showCreateEventModal;
    },
    gotoTable(){
      this.$router.push({name: 'table', params: {id: this.table.id}});
    },
    deleteCampain(id) {
      axios({
        method: 'delete',
        url: `/campains/campains/${this.campain.id}/`,
        headers: {
          'Authorization': `Token ${this.$store.state.token}`
        }
      })
      .then(response => {
        console.log(response)
        this.$router.push({name: 'table', params: {id: this.table.id}});
      })
      .catch(error => {
        console.log(error)
      })
    }
  }


}
</script>

<style scoped>
img {
  height: 256px;
  width: auto;
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
.modal {
  overflow: auto;
}
.delete {
  background-color: rgb(200, 50, 50);
}

.sep {
  border-bottom: 1px solid rgb(106, 227, 221);
}
.line-hoverable {
  user-select: none;
}
.line-hoverable:hover {
  background-color: rgb(130, 234, 229);
  color: rgb(92, 92, 92);
}

</style>