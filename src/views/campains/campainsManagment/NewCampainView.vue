<template>
<div>
  <form class="form">
    <h1 class="title">Start a New Campain</h1>
    <h2 class="subtitle"> {{ charLimit(table.name) }} </h2>

    <ul v-if="errors.length">
      <li class="is-danger" v-for="error in errors" :key="error" style="color: red;">
        {{ error }}
      </li>
    </ul>


    <div class="mt-2">

      <label class="label">Language</label>
      <select name="" id="" v-model="language">
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



    <button class="button is-success mt-2" @click.prevent="onSubmit">Confirm</button>
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
      game: '',
      image_url: '',
      language: 'en',
      campainTitle: "",
      camapainDescription: "",
      errors: [],
    }
  },
  beforeMount() {
    this.table = this.$store.state.current_table
  },
  methods: {
    charLimit(text) {
      if (text.length <= 25) {
        return text;
      }
      return text.slice(0, 22) + '...';
    },
    onSubmit() {
      this.errors = []

      if (this.game === '') {
        this.errors.push("You must enter a game")
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
          game: this.game,
          title: this.campainTitle,
          description: this.camapainDescription,
          image_url: this.image_url,
          language: this.language,
        }
      })
      .then(response => {
        console.log(response.data)
        this.$router.push({name: "table", params: {id: this.$store.state.current_table.id}})
      })
      .catch(error => {
        console.log(error.response.data.errors)
        if (typeof(error) == Array) {
          this.errors = error.response.data.errors
        } else {
          // the expected way
          this.errors.push(
            error.response.data.errors[0])
        }
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