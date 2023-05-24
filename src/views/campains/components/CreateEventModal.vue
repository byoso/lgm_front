<template>
  <div class="modal" :class="{'is-active': showCreateEventModal}">
    <div class="modal-background" @click="$emit('closeCreateEventModal')"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Create a new event</p>
        <button class="delete" aria-label="close" @click="$emit('closeCreateEventModal')"></button>
      </header>
      <section class="modal-card-body">
        <form>
          <div class="control">
            <label class="label">Title</label>
            <input class="input" type="text" placeholder="Text input">
            <label class="label">Type</label>
            <div class="select">
              <select>
                <option>NPC</option>
                <option>Place</option>
                <option>Event</option>
              </select>
            </div>
            <label class="label">PC's infos</label>
            <textarea class="textarea" placeholder="Textarea"></textarea>
            <div v-if="user.id === campain.game_master.user.id">
              <label class="label">GM's infos</label>
              <textarea class="textarea" placeholder="Textarea"></textarea>
            </div>
          </div>
        </form>
      </section>
      <footer class="modal-card-foot">
        <button class="button is-success">Save</button>
        <button class="button" @click="$emit('closeCreateEventModal')">Cancel</button>
      </footer>
    </div>
  </div>

</template>

<script>
import axios from 'axios'



export default {
  name: 'CreateEventModal',
  props: [
    'showCreateEventModal',
    'campain',
    'user',
  ],
  methods: {
  }

}
</script>

<style scoped>

</style>