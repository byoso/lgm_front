<template>
<div class="box m-2 is-half campain" @click="gotoCampain(campain.id)">
  <h1 class="campainTitle">{{ campain.title}}</h1>
  <h2 >{{ campain.game.name }}</h2>


  <figure class="image is-128x128 is-pulled-right">
    <img v-if="campain.game.image_url" :src="campain.game.image_url">
    <img v-else src="https://bulma.io/images/placeholders/128x128.png">
  </figure>
  <ul>
    <li>game master: {{ campain.game_master.character_name }}</li>
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
  props: ['campain'],
  methods: {
    gotoCampain(id) {
      this.$store.current_campain = this.campain;
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