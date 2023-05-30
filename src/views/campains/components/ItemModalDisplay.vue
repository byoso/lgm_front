<template>

  <div class="modal" :class="{'is-active': showIt}">
    <div class="modal-background" @click="$emit('showModalDisplay')"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">{{ item.name }}</p>
        <button class="delete" aria-label="close" @click="this.$emit('showModalDisplay')"></button>
      </header>
      <section class="modal-card-body">
        <p>My Item</p>

      </section>
    </div>
  </div>


</template>

<script>
export default {
  name: 'ItemModalDisplay',
  props: [
    'showIt',
    'item',
    'user',
  ],
  data() {
    return {
      show: false,
    }
  },

}
</script>

<style>

</style>