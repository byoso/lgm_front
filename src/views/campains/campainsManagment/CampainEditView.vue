<template>
<div>
  <form class="form">
    <h1 class="title">Edit Campain</h1>
    <h2 class="subtitle"> {{ charLimit(campainTitle) }} </h2>

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

      <div class="m-2">
        <strong>Is this campain is ended ?  </strong><input type="checkbox" v-model="is_ended">
      </div>

      <div v-if="campain.is_copy_free">
        <label class="label m-2">is copy locked ?
          <p>
            Once it is checked, it can not be unchecked.
          </p>
          <p>
            A locked camapain will not be albe to export any items at all,
            but will be able to import items from any other campains and collections.
          </p>
          <p>
            This feature prevents copyright issues.
          </p>
          <div class="m-2">
          <button class="button is-small is-warning mr-2" @click="allowCopyLock=true">I Understand</button>
          <input type="checkbox"  v-model="is_copy_locked" :disabled="!allowCopyLock">

          </div>
        </label>
      </div>
      <div v-else>
        <p>This campain is copy locked <fa icon="lock" style="color: red;"/> </p>
      </div>

    </div>


    <button class="button is-success mt-2" @click.prevent="onSubmit">Confirm</button>
    <button class="button is-secondary m-2" @click.prevent="onCancel">Cancel</button>

    <button class="button is-warning m-2"
    @click="allowDeleteCampain = !allowDeleteCampain">
    delete campain
    </button>
    <button  :disabled="!allowDeleteCampain"
    @click.prevent="deleteCampain(campain.id)"
    class="button is-danger m-2">Confirm deletion
    </button>
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
      game: '',
      image_url: '',
      language: 'en',
      gameMasterId: null,
      campainTitle: "",
      camapainDescription: "",
      is_copy_locked: false,
      errors: [],
      allowDeleteCampain: false,
      allowCopyLock: false,
    }
  },
  beforeMount() {
    this.table = this.$store.state.current_table
    this.campain = this.$store.state.current_campain
    this.game = this.campain.game
    this.image_url = this.campain.image_url
    this.language = this.campain.language
    this.campainTitle = this.campain.title
    this.camapainDescription = this.campain.description
    this.gameMasterId = this.campain.game_master.id
    this.is_copy_locked = !this.campain.is_copy_free
    this.is_ended = this.campain.is_ended
    console.log("campain: \n",this.campain)

  },
  computed: {
    isGameMaster() {
      return this.user.id === this.campain.game_master.id;
    },
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
      if (this.gameMasterId === null) {
        this.errors.push("You must select a master")
      }
      if (this.errors.length > 0) {
        return

      }

      let data = {
        campain_id: this.campain.id,
        game: this.game,
        title: this.campainTitle,
        description: this.camapainDescription,
        image_url: this.image_url,
        language: this.language,
        is_copy_free: !this.is_copy_locked,
        is_ended: this.is_ended,
      }
      console.log("send to update: \n", data)
      axios({
        method: 'put',
        url: '/campains/update_campain/',
        headers: {
          'Authorization': `Token ${this.$store.state.token}`
        },
        data: data
      })
      .then(response => {
        console.log(response)
        this.$router.push({name: "CampainView", params: {id: this.$store.state.current_campain.id}})
      })
      .catch(error => {
        console.log(error.response.data)
        this.errors.push(error.response.data.message)
      })

    },
    onCancel() {
      this.$router.push({name: "CampainView", params: {id: this.$store.state.current_campain.id}})
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
    },
  }

}
</script>

<style scoped>

.form {
  width: 50%;
  margin: auto;
}
</style>