<template>

<form class="form">
  <h1 class="title">Create a new table</h1>

  <h2 class="subtitle">The table</h2>

  <label class="label">Name</label>
  <input type="text" class="input" placeholder="Name the table" v-model="name" required>

  <label class="label">Description</label>
  <textarea type="textarea" class="textarea" rows=6 v-model="description">
  </textarea>

<hr>

  <label>Password for the guests</label>
  <input type="text" class="input" placeholder="Password for the guests" v-model="table_password">

  <h2 class="subtitle">The Guests</h2>
  <p class="mb-2">You can add guests later if you prefer.</p>


  <span class="button is-success is-small m-2" @click="addOneGuest">Add more guests</span>

  <span v-if="guests.length" class="button is-danger is-small m-2" @click="removeOneGuest">Remove the last guest</span>


  <div v-for="(guest, index) in guests" :key="index" :id="index" class="field">
      <label class="label">Guest {{ index+1 }}</label>
      <div class="control field is-grouped">

          <input type="email" class="input guest_email" v-model="guests[index].email" placeholder="Enter the guest's email">
          <span class="button is-danger is-right ml-2" @click="removeGuest(index)">X</span>

    </div>
  </div>

  <div v-if="errors.length">
    <ul>
      <li v-for="error in Object.values(errors[0])" :key="error" style="color: red;">
        {{ error[0] }}
      </li>
    </ul>
  </div>

  <br>
  <button class="button is-success mt-2" @click="onSubmit">Confirm</button>

</form>

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
      errors: [],
      table_password: "",

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
        console.log("guests in list: ", guestsList)
        console.log("guests :", this.guests[0])
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
            table_password: this.table_password,
          }
        })
        .then(response => {
          console.log(response.data);
          this.$router.push({ name: "dashboard" });
        })
        .catch(error => {
          if (error.response) {
            this.errors.push(error.response.data);
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