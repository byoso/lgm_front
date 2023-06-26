<template>
  <span class="official" :class="{'hoverable-official': has_url}">
    <a v-if="has_url" :href="collection.official_url" target="_blank" style="text-decoration: none;">
      official
    </a>
    <span v-else>
    official
    </span>
  </span>


</template>

<script>
export default {
  name: "OfficialMark",
  props: [
    'collection',
  ],
  computed: {
    has_url() {
      if (this.collection.official_url === null) {
        return false
      } else {
        return true
      }
    },
  },
}
</script>

<style scoped>

a {
  color: black;
  text-decoration: none;
}

a:visited {
  color: black;
}

.hoverable-official:hover {
  background-color: gold;
  color: black;
  cursor: pointer;
}

.official {
  color: black;
  background-color: goldenrod;
  font-weight: bold;
  font-size: 0.9rem;
  border: 2px solid black;
  border-radius: 5px;
  margin: 4px;
  user-select: none;
}

</style>