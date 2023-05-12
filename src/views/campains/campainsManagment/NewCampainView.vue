<template>
<div>
  <form class="form">
    <h1 class="title">Start a New Campain</h1>
    <h2 class="subtitle"> {{ table.name }} </h2>

    <label class="label">Game</label>
    <div class="select">
      <select v-model="selectedGame">
        <option v-for="game in games" :key="game.id" :value="game.id">{{ game.name }}</option>
      </select>
    </div>
    <div class="mt-2">
      <label class="label">Campain Name</label>
      <input type="text" placeholder="Campain name" class="input" v-model="campainTitle">

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
            <input type="text" placeholder="Character name" class="input">
          </td>
          <td>
            <input type="radio" name="master" :value="player.id" v-model="master" class="radio">
          </td>
        </tr>
      </tbody>
    </table>

    name: {{ campainTitle }}<br>
    game: {{ selectedGame }} <br>
    master: {{ master }} <br>


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
      games: [],
      selectedGame: null,
      master: null,
      campainTitle: "New Campain",
    }
  },
  beforeMount() {
    this.table = this.$store.state.current_table
    this.players = this.table.owners.concat(this.table.guests)
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
      console.log("submit")
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