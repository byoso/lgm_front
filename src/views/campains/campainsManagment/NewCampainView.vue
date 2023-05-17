<template>
<div>
  <form class="form">
    <h1 class="title">Start a New Campain</h1>
    <h2 class="subtitle"> {{ table.name }} </h2>

    <ul v-if="errors.length">
      <li class="is-danger" v-for="error in errors" :key="error" style="color: red;">
        {{ error }}
      </li>
    </ul>


    <label class="label">Game</label>
    <div class="select">
      <select v-model="selectedGame">
        <option v-for="game in games" :key="game.id" :value="game.id">{{ game.name }}</option>
      </select>
    </div>
    <div class="mt-2">
      <label class="label">Campain title</label>
      <input type="text" placeholder="Campain name" class="input" v-model="campainTitle">
      <label class="label">Description</label>
      <textarea class="textarea" placeholder="Campain description" v-model="camapainDescription"></textarea>

    </div>

    <table class="table is-fullwidth mt-2">
      <thead>
        <tr>
          <th>Players</th>
          <th>Characters</th>
          <th>Master</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="player in players" :key="player.id">
          <td>
            {{ player.username }}
          </td>
          <td>
            <input type="text" placeholder="Character name" class="input" v-model="pcs[player.id].name">
          </td>
          <td>
            <input type="radio" name="master" :value="player.id" v-model="master" class="radio">
          </td>
        </tr>
      </tbody>
    </table>


    <button class="button is-success" @click.prevent="onSubmit">Confirm</button>
  </form>

</div>


</template>

<script>
import axios from "axios"

export default {
  name: "NewCampainView",
  data() {
    return {
      table: {},
      players: [],
      pcs: {},
      games: [],
      selectedGame: null,
      master: null,
      campainTitle: "",
      camapainDescription: "",
      errors: [],
    }
  },
  beforeMount() {
    this.table = this.$store.state.current_table
    this.players = this.table.owners.concat(this.table.guests)
    for (var i=0; this.players.length > i; i++) {
      this.pcs[this.players[i].id] = {id: this.players[i].id, name: ""}
    }
    axios({
      method: "get",
      url: "/campains/get_games_list/",
      headers: {
        Authorization: `Token ${this.$store.state.token}`
      },
    })
    .then(response => {
      this.games = response.data
      console.log("games: ", this.games)
    })
    .catch(error => {
      console.log(error)
    })


  },
  methods: {
    onSubmit() {
      this.errors = []
      if (this.master === null) {
        this.errors.push("You must select a master")
      }
      if (this.selectedGame === null) {
        this.errors.push("You must select a game")
      }
      if (this.campainTitle === "") {
        this.errors.push("You must enter a title")
      }
      if (this.errors.length > 0) {
        return

      }
      axios({
        method: 'post',
        url: '/campains/campains/',
        headers: {
          'Authorization': `Token ${this.$store.state.token}`
        },
        data: {
          table_id: this.table.id,
          game_id: this.selectedGame,
          master_id: this.master,
          title: this.campainTitle,
          pcs: this.pcs,
          description: this.camapainDescription,
        }
      })
      .then(response => {
        console.log(response.data)
        this.$router.push({name: "table", params: {id: this.$store.state.current_table.id}})
      })
      .catch(error => {
        console.log(error)
        this.errors = error.response.data
      })

    }
  }

}
</script>

<style>

.form {
  width: 50%;
  margin: auto;
}
</style>