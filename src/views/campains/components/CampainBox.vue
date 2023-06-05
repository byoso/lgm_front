<template>
<div class="box m-2 is-3 campain" @click="gotoCampain(campain.id)">
  <h1 class="campainTitle">{{ campain.title}}</h1>
  <h2 >{{ campain.game }}</h2>


  <figure v-if="campain.image_url" class="image is-128x128 is-pulled-right">
    <img :src="campain.image_url">
  </figure>
  <ul>
    <li>game master: {{ campain.game_master.username }}</li>
    <li>description: {{ campain.description }}</li>
    <li>is ended ? : {{ campain.is_ended }}</li>
    <ul>
      <li v-for="pc in campain.campain_pcs" :key=pc.id>- {{pc.user.username}} as {{ pc.character_name }}</li>
    </ul>

  </ul>

</div>
</template>

<script>
export default {
  name: "CampainBox",
  props: [
    'campain'
  ],
  methods: {
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
  text-align:left;
  width:40%;
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
}

.campainTitle {
  font-size: 1.5em;
  font-weight: bold;
  text-align: center;
  margin-bottom: 10px;
}

</style>