<template>

  <div class="dropdown is-hoverable">
    <div class="dropdown-trigger">
      <button class="button is-small" aria-haspopup="true" aria-controls="dropdown-menu3">
        <span>actions</span>
        <span class="icon is-small">
          <i class="fas fa-angle-down" aria-hidden="true"></i>
          <fa icon="angle-down"/>
        </span>
      </button>
    </div>
    <div class="dropdown-menu" id="dropdown-menu3" role="menu">
      <div class="dropdown-content">
        <a class="dropdown-item" @click="$emit('newCampainFromMyCollection', collection)">
          Use for a new campaign
        </a>
        <a class="dropdown-item" @click="$emit('favoritesAction', collection)">
          <span>
            <fa icon="heart" style="color: red;"/>
            add/remove favorite
          </span>

        </a>
      </div>
    </div>

  </div>
</template>

<script>

export default {
  name: 'ActionsButton',
  components: {
  },
  props: [
    'collection',
    'tables',
  ],
  data() {
    return {
      showTablesModal: false,
    }
  },
}
</script>

<style>

</style>