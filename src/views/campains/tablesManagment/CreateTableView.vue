<template>

<div class="container is-max-desktop">
  <form>
    <h1 class="title">Create a new table</h1>

    <h2 class="subtitle">The table</h2>

    <label class="label">Name</label>
    <input type="text" class="input" placeholder="Name the table" v-model="name" required>
    <p v-for="error in errors.name" style="color:red;" :key="error">{{ error }}</p>

    <label class="label">Description</label>
    <textarea type="textarea" class="textarea" rows=6 v-model="description">
    </textarea>

  <hr>


    <h2 class="subtitle">The Guests emails</h2>
    <p class="mb-2">You can add guests later if you prefer.</p>


    <span class="button is-success is-small m-2" @click="addOneGuest">Add more guests</span>

    <span v-if="guests.length" class="button is-danger is-small m-2" @click="removeOneGuest">Remove the last guest</span>


    <div v-for="(guest, index) in guests" :key="index" :id="index" class="field">
        <label class="label">Guest email{{ index+1 }}</label>
        <div class="control field is-grouped">

            <input type="email" class="input guest_email" v-model="guests[index].email" placeholder="Enter the guest's email">
            <span class="button is-danger is-right ml-2" @click="removeGuest(index)">X</span>

      </div>
    </div>

    <br>
    <button class="button is-success mt-2" @click="onSubmit">Confirm</button>

  </form>

</div>

</template>

<script>
import axios from 'axios';


export default {
  name: "CreateTableView",
  components: {
  },
  data(){
    return {
      name: "",
      description: "",
      guests: [],
      base_key: 0,
      errors: {},

    }
  },
  methods: {
    addOneGuest() {
      this.guests.push({
        email: ""
,
      });
    },
    removeOneGuest() {
      this.guests.pop();
      this.base_key -= 1;
    },
    removeGuest(id) {
      this.guests.splice(id, 1);
    },
    getKey() {
      this.base_key += 1;
      return this.base_key;
    },
    getGuestsList() {
      let guestsInList = [];
      for (var i=0; i<this.guests.length; i++) {
        if (this.guests[i].email != "") {
          guestsInList.push(this.guests[i].email);
        }
      }
      return guestsInList;
    },
    onSubmit() {
      if (this.name != "") {
        let guestsList = this.getGuestsList();
        this.errors = [];
        axios({
          method: "POST",
          url: "campains/tables/",
          headers: {
            Authorization: `Token ${this.$store.state.token}`
          },
          data: {
            name: this.name,
            description: this.description,
            guests: guestsList,
          }
        })
        .then(response => {
          this.$router.push({ name: "dashboard" });
        })
        .catch(error => {
          if (error.response) {
            console.log(error.response.data);
            this.errors = error.response.data;
          }
        })

      }
    },
  }


}
</script>

<style>
.form {
  width: 50%;
  margin: auto;
}

</style>