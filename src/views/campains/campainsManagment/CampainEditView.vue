<template>
<div>
  <form class="form">
    <h1 class="title">Edit Campain</h1>
    <h2 class="subtitle"> {{ campainTitle }} </h2>

    <ul v-if="errors.length">
      <li class="is-danger" v-for="error in errors" :key="error" style="color: red;">
        {{ error }}
      </li>
    </ul>


    <div class="mt-2">

      <label class="label">Language</label>
      <select v-model="language">
        <option value="ar">Arabic</option>
        <option value="cs">Czech</option>
        <option value="zh">Chinese</option>
        <option value="da">Danish</option>
        <option value="nl">Dutch</option>
        <option value="en">English</option>
        <option value="fi">Finnish</option>
        <option value="fr">French</option>
        <option value="de">German</option>
        <option value="el">Greek</option>
        <option value="hi">Hindi</option>
        <option value="hu">Hungarian</option>
        <option value="it">Italian</option>
        <option value="ja">Japanese</option>
        <option value="ko">Korean</option>
        <option value="no">Norwegian</option>
        <option value="fa">Persian</option>
        <option value="pl">Polish</option>
        <option value="pt">Portuguese</option>
        <option value="ru">Russian</option>
        <option value="es">Spanish</option>
        <option value="sv">Swedish</option>
        <option value="th">Thai</option>
        <option value="tr">Turkish</option>
        <option value="vi">Vietnamese</option>

      </select>
      <label class="label">Game</label>
      <input type="text" placeholder="Game name" class="input" v-model="game">
      <label class="label">Campain title</label>
      <input type="text" placeholder="Campain title" class="input" v-model="campainTitle">
      <label class="label">Image url</label>
      <input type="text" placeholder="Image url" class="input" v-model="image_url">
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
            <input type="radio" name="gameMasterId" :value="player.id" v-model="gameMasterId" class="radio">
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
  name: "CampainEditView",
  data() {
    return {
      user: this.$store.state.user,
      campain: {},
      table: {},
      players: [],
      pcs: {},
      game: '',
      image_url: '',
      language: 'en',
      gameMasterId: null,
      campainTitle: "",
      camapainDescription: "",
      errors: [],
    }
  },
  beforeMount() {
    this.table = this.$store.state.current_table
    this.campain = this.$store.state.current_campain
    this.players = this.table.owners.concat(this.table.guests)
    console.log("characters: ", this.campain.campain_pcs)
    for (var i=0; this.players.length > i; i++) {
      console.log("player: ", this.players[i])
      let character = this.campain.campain_pcs.find(pc => pc.user.id === this.players[i].id)
      this.pcs[this.players[i].id] = {id: this.players[i].id, name: character.character_name}
    }
    this.game = this.campain.game
    this.image_url = this.campain.image_url
    this.language = this.campain.language
    this.campainTitle = this.campain.title
    this.camapainDescription = this.campain.description
    this.gameMasterId = this.campain.game_master.user.id
    console.log("campain: \n",this.campain)

  },
  computed: {
    isGameMaster() {
      return this.user.id === this.campain.game_master.user.id;
    },
  },
  methods: {
    onSubmit() {
      this.errors = []

      if (this.game === '') {
        this.errors.push("You must enter a game")
      }
      if (this.campainTitle === "") {
        this.errors.push("You must enter a title")
      }
      if (this.gameMasterId === null) {
        this.errors.push("You must select a master")
      }
      if (this.errors.length > 0) {
        return

      }

      let data = {
        table_id: this.table.id,
        game: this.game,
        master_id: this.gameMasterId,
        title: this.campainTitle,
        pcs: this.pcs,
        description: this.camapainDescription,
        image_url: this.image_url,
        language: this.language,
      }
      console.log("send to update: \n", data)
      // axios({
      //   method: 'put',
      //   url: '/campains/update/',
      //   headers: {
      //     'Authorization': `Token ${this.$store.state.token}`
      //   },
      //   data: data
      // })
      // .then(response => {
      //   console.log(response.data)
      //   this.$router.push({name: "table", params: {id: this.$store.state.current_table.id}})
      // })
      // .catch(error => {
      //   console.log(error.response.data.errors)
      //   if (typeof(error) == Array) {
      //     this.errors = error.response.data.errors
      //   } else {
      //     // the expected way
      //     this.errors.push(
      //       error.response.data.errors[0])
      //   }
      // })

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