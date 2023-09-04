<template>
<div class="container">
  <div class="about">

    <div class="logo is-hidden-mobile">
      <img src="favicon.ico" class="logo-image" alt="logo">
      <h1 class="logo-title">
        RPGAdventure.eu
      </h1>
    </div>

    <h1 class="title ">About RPGAdventure.eu</h1>

    <p class="content">Produced by <a href="https://ppws.fr" target="blank">ppws.fr</a></p>
    <br>
    <p class="content">
      RPGAdventure.eu is, above all, a tool created by enthusiasts for enthusiasts.
    </p>
    <br>
    <p class="content">
      After many years of tabletop roleplaying, we felt that there was a need for a tool to make the various
       elements of a campaign more concrete and engaging for players,
       especially when the campaign spans several months or even years.
    </p>
    <br>
    <p class="content">
      We hope that this application will be as useful to you as it is to us.
      However, since perfection is not of this world, your suggestions are always welcome.
       You can send them to us at <a href="mailto:contact@rpgadventure.eu" target="blank">contact@rpgadventure.eu</a>.
    </p>
    <br>
    <p class="content">
      Happy gaming!
    </p>



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
p {
  text-align: justify;
  font-size: 1.2em;
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