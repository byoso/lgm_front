<template>
<div class="container is-max-desktop">
  <div class="about">

    <div class="logo is-hidden-mobile">
      <img src="favicon.ico" class="logo-image" alt="logo">
      <h1 class="logo-title">
        RPGAdventure.eu
      </h1>
    </div>

    <h1 class="title ">About RPGAdventure.eu</h1>
   </div>

</div>
</template>

<script>
export default {
  name: 'AboutView',
  components: {
  }
}
</script>

<style scoped>
.about {
  text-align: center;
}

.logo {
  display: flex;
  margin-left: auto;
  margin-right: auto;
  width: 800px;
}
.logo-title {
  margin-top: 20px;
  font-size: 6em;
  color: rgb(60, 99, 255);
}
.logo-image {
  width: 150px;
  height: 150px;
  margin-right: 10px;
}

</style>