<template>

<div class="container is-max-desktop">
  <form>
    <h1 class="title">Edit table '{{ name }}'</h1>

    <h2 class="subtitle">The table</h2>

    <label class="label">Name</label>
    <input type="text" class="input" placeholder="Name the table" v-model="name" required>
    <p v-for="error in errors.name" style="color:red;" :key="error">{{ error }}</p>

    <label class="label">Description</label>
    <textarea type="textarea" class="textarea" rows=6 v-model="description">
    </textarea>

  <hr>

    <h2 class="subtitle">The Guests emails</h2>

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
    <button class="button is-success m-2" @click="onSubmit">Confirm</button>
    <span class="button is-warning m-2" @click="unSafeDelete">Delete '{{ name }}'</span>
    <button class="button is-danger m-2" :disabled="allowDelete" id="deleteButtonId" @click.prevent="deleteTable">Confirm delete</button>

  </form>

</div>

</template>

<script>
import axios from 'axios';
import { toast } from 'bulma-toast';


export default {
  name: "EditTableView",
  components: {
  },
  data(){
    return {
      table_id: this.$route.params.id,
      name: "",
      description: "",
      guests: [],
      base_key: 0,
      errors: {},
      allowDelete: true,
    }
  },
  beforeMount() {
    this.table_id = this.$route.params.id,
    axios(
      {
        method: 'get',
        url: '/campains/get_table_datas/',
        headers: {
          'Authorization': `Token ${this.$store.state.token}`
        },
        params: {
          "table_id": this.table_id,
        }
      }
    ).then(response => {
      this.name = response.data['name'];
      this.description = response.data['description'];
      for (var i=0; i<response.data['guests'].length; i++) {
        this.guests.push({
          email: response.data['guests'][i].email,
        });
      }
    }
    ).catch(error => {
      console.log(error);
    })
  },
  methods: {
    unSafeDelete() {
      this.allowDelete = !this.allowDelete;
    },
    deleteTable() {
      axios(
        {
          method: 'delete',
          url: '/campains/tables/' + this.table_id + '/',
          headers: {
            'Authorization': `Token ${this.$store.state.token}`
          },
        }
      ).then(response => {
        toast({
          message: "Table deleted",
          type: "is-success",
          position: 'bottom-right',
          dismissible: true,
          pauseOnHover: true,
          duration: 5000,
        });
        this.$router.push({ name: "dashboard" });
      }
      ).catch(error => {
        console.log(error);
      }
      )
    },
    addOneGuest() {
      this.guests.push({
        email: "",
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
          method: "PUT",
          url: `campains/tables/${this.table_id}/`,
          headers: {
            Authorization: `Token ${this.$store.state.token}`,
          },
          data: {
            name: this.name,
            description: this.description,
            guests: guestsList,
            table_password: this.table_password,
          }
        })
        .then(response => {
          this.$store.state.current_table = response.data
          this.$router.push({ name: 'table', params: { id: this.table_id } });
        })
        .catch(error => {
            this.errors = error.response.data;
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