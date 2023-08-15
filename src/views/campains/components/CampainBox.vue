<template>
  <div>
    <div class="box m-2 campain is-hidden-mobile" @click="gotoCampain(campain.id)"
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
      <div class="m-3">
        mastered by {{ charLimit(campain.game_master.username) }}
      </div>
    </div>

    <!-- <div class="box media m-2 is-hidden-desktop" @click="gotoCampain(campain.id)"
    :class="{'mastering': user.id===campain.game_master.id, 'not-mastering': user.id!==campain.game_master.id}"
    >
      <h2 class="campainTitle-mobile is-4">{{ campain.title }}</h2>
      <figure v-if="campain.image_url != ''" class="image-mobile">
        <img :src="campain.image_url" alt="campain image">
      </figure>

    </div> -->

    <div class="m-1 campain-mobile is-hidden-desktop " @click="gotoCampain(campain.id)"
      :class="{
        'mastering': user.id===campain.game_master.id,
        'not-mastering': user.id!==campain.game_master.id
        }"
        >
      <div class="columns is-mobile">
        <div class="column">
          <span class="campainTitle-mobile">
            {{ campain.title }}
          </span>
        </div>
        <div class="column">
          <figure v-if="campain.image_url != ''" class="image-mobile">
            <img :src="campain.image_url" alt="campain image">
          </figure>
        </div>
      </div>

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
.box {
  max-width: none !important;
  width: 100%;
}

.campain {
  background-color: #f5f5f5;
  padding: 10px;
  border: 1px solid #DDD;
  border-radius: 10px;
  text-align:center;
  max-height: 400px;
}

.campain:hover {
  border: 1px solid lightseagreen;
  cursor: pointer;
  transform: scale(1.05);
  transition: all 0.1s ease-in-out;
}

.campain-mobile {
  background-color: #f5f5f5;
  padding: 5px;
  border-radius: 10px;
  max-height: 100px;
  min-width: 360px;
}

.image {
  height: 128px;
  width: 96px;
  margin-left: auto;
  margin-right: auto;
  overflow: hidden;
}

.image-mobile {
  height: 64px;
  width: 48px;
  margin-left: auto;
  overflow: hidden;
}

.campainTitle {
  font-size: 1.5em;
  font-weight: bold;
  text-align: center;
  margin-bottom: 10px;
}

.campainTitle-mobile {
  font-size: 1.2em;
  font-weight: bold;
  margin-right: auto;
}

.not-mastering {
  border: 2px solid rgb(240, 194, 77);
}

.mastering {
  border: 2px solid rgb(90, 193, 116);
}

</style>