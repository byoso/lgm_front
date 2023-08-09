<template>
<div class="box m-2 campain" @click="gotoCampain(campain.id)"
:class="{'mastering': user.id===campain.game_master.id, 'not-mastering': user.id!==campain.game_master.id}"
>
  <h2 class="campainTitle">
    {{ charLimit(campain.title) }}
  </h2>
  <h2 >{{ charLimit(campain.game) }}</h2>
  <div>
    <figure v-if="campain.image_url" class="image is-128x128">
      <img :src="campain.image_url">
    </figure>
  </div>
  <div class="m-2">
    mastered by {{ charLimit(campain.game_master.username) }}
  </div>
</div>
</template>

<script>

export default {
  name: "CampainBox",
  props: [
    'campain',
    'user',
  ],
  methods: {
    charLimit(text) {
      if (text.length <= 25) {
        return text;
      }
      return text.slice(0, 22) + '...';
    },
    gotoCampain(id) {
      this.$store.state.current_campain = this.campain;
      this.$router.push({name: 'CampainView', params: {id: id}});
    }
  }

}
</script>

<style scoped>
.campain {
  background-color: #f5f5f5;
  padding: 10px;
  border: 1px solid #DDD;
  border-radius: 10px;
  text-align:center;
  /* width:40%; */
  max-height: 400px;
}
.campain:hover {
  border: 1px solid lightseagreen;
  cursor: pointer;
  transform: scale(1.05);
  transition: all 0.1s ease-in-out;
}

.image {
  height: 128px;
  width: 96px;
  margin-left: auto;
  margin-right: auto;
}

.campainTitle {
  font-size: 1.5em;
  font-weight: bold;
  text-align: center;
  margin-bottom: 10px;
}

.not-mastering {
  border: 2px solid rgb(240, 194, 77);
}

.mastering {
  border: 2px solid rgb(90, 193, 116);
}

</style>