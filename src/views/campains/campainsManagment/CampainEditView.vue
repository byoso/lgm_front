<template>
<div class="container is-max-desktop">
  <form>
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
        <label class="label m-2">
          is copy locked ?
        </label>
          <p class="text">
            Once it is checked, it can not be unchecked.
          </p>
          <p class="text">
            A locked campaign will not be albe to export any items at all,
            but will be able to import items from any other campaigns and collections.
          </p>
          <p class="text">
            This feature prevents copyright issues.
          </p>
          <p class="text">
            DO NOT CHECK if you want to create a collection from this campaign.
          </p>
          <div class="m-2">
          <button class="button is-small is-warning mr-4" @click="allowCopyLock=true">I Understand</button>
          <input type="checkbox" class="ml-4"  v-model="is_copy_locked" :disabled="!allowCopyLock">

          </div>
      </div>
      <div v-else>
        <p>This campaign is copy locked <fa icon="lock" style="color: red;"/> </p>
      </div>

    </div>


    <button class="button is-success mt-2" @click.prevent="onSubmit">Confirm</button>
    <button class="button is-secondary m-2" @click.prevent="onCancel">Cancel</button>

    <button class="button is-warning m-2"
    @click="allowDeleteCampain = !allowDeleteCampain">
    delete campaign
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
      is_ended: false,
      errors: [],
      allowDeleteCampain: false,
      allowCopyLock: false,
    }
  },
  beforeMount() {
    this.table = this.$store.state.current_table
    this.campain = this.$store.state.current_campain
    this.game = this.$store.state.current_campain.game
    this.image_url = this.$store.state.current_campain.image_url
    this.language = this.$store.state.current_campain.language
    this.campainTitle = this.$store.state.current_campain.title
    this.camapainDescription = this.$store.state.current_campain.description
    this.gameMasterId = this.$store.state.current_campain.game_master.id
    this.is_copy_locked = !this.$store.state.current_campain.is_copy_free
    this.is_ended = this.$store.state.current_campain.is_ended

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
      axios({
        method: 'put',
        url: '/campains/update_campain/',
        headers: {
          'Authorization': `Token ${this.$store.state.token}`
        },
        data: data
      })
      .then(response => {
        this.campain.game = this.game
        this.campain.title = this.campainTitle
        this.campain.description = this.camapainDescription
        this.campain.image_url = this.image_url
        this.campain.language = this.language
        this.campain.is_copy_free = !this.is_copy_locked
        this.campain.is_ended = this.is_ended
        this.$store.commit('setCurrentCampain', this.campain)
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
.text {
  word-break: keep-all;
}

.form {
  width: 50%;
  margin: auto;
}
</style>