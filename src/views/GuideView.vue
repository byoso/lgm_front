<template>
<div class="container">
    <div class="logo mb-6">
      <img src="favicon.ico" class="logo-image" alt="logo">
      <h1 class="logo-title">
        RPGAdventure.eu
      </h1>
    </div>
  <h1 class="title is-2">First steps guide</h1>

  <div @click="showWhatIs = !showWhatIs" class="topic">

      What is RPGAdventure.eu ?
      <div class="is-pulled-right mr-2">
        <fa v-if="showWhatIs" icon="angle-down"/>
        <fa v-if="!showWhatIs" icon="angle-right"/>
      </div>
  </div>
  <div v-if="showWhatIs">
    <br>
    <p>
      It is a tool for RPG masters and players to help them to handle the
      mass of information displayed when playing a RPG in an elegant way.
    </p>
    <div>
      <img src="img/guide/cards-campains.png" alt="campain items">
    </div>
    <br>
    <p class="text">
      During a RPG campain, the game master will disclose informations to the
      players as they discover new elements (NPCs, LOCATIONs, ORGANIZATIONs...).
      Each element is displayed under the form of a card.
    </p>

    <div>
      <img src="img/guide/cards-items.png" alt="campain items">
    </div>
    <br>
    <p class="text">
      While a campain is often played on long period of time, the game master and the players
      can dive instantly into the game, consulting the item cards to remind them the discovered elements
      of the scenario, and their details.
    </p>
    <br>
    <p class="text">
      Each card can contain datas for the player, but also datas only readable
      by the game master.
    </p>

    <div class="columns">
      <div class="column m-2">
        <p><strong>Player's view</strong></p>
        <img src="img/guide/card-item-player.png" alt="item player view" class="card-example">
      </div>
      <div class="column m-2">
        <p><strong>Game master's view</strong></p>
        <img src="img/guide/card-item-GM.png" alt="item GM view" class="card-example">
      </div>
    </div>

    <div>
    </div>
    <br>

    <h2 class="title is-4">About subscriptions</h2>
    <p class="text">
      Only the game master needs an active subscription to use RPGAdventure.eu, simple players
      can play as guests.
    </p>
    <button class="m-4 button" @click="showWhatIs=false">close this topic</button>
  </div>
  <br>

  <div @click="showQuickWay = !showQuickWay" class="topic">

    The quick way to beggin
    <div class="is-pulled-right mr-2">
      <fa v-if="showQuickWay" icon="angle-down"/>
      <fa v-if="!showQuickWay" icon="angle-right"/>
    </div>
  </div>
  <div v-if="showQuickWay">
    <br>
    <p class="text">
      a few steps:
      <ul>
        <li>
          - Sign up
        </li>
        <li>
          - Have an active subscription (30 days free trial)
        </li>
        <li>
          - Create a virtual table: add the e-mail addresses of your guests (guests do not need a subscription), they will receive an invitation in their inbox.
        </li>
        <li>
          - Create a campain from the table view.
        </li>
        <li>
          - Add items to your campain while playing.
        </li>
      </ul>
    </p>
    <button class="m-4 button" @click="showQuickWay=false">close this topic</button>
  </div>

  <br>
  <div @click="showExpertWay = !showExpertWay" class="topic">

    The expert way
    <div class="is-pulled-right mr-2">
      <fa v-if="showExpertWay" icon="angle-down"/>
      <fa v-if="!showExpertWay" icon="angle-right"/>
    </div>
  </div>
  <div v-if="showExpertWay">
    <br>
      <p>
      I'd recommend you to have at least tried the quick way before trying this one.
      </p>
      <br>
      <ul>
        <li>
          - Sign up
        </li>
        <li>
          - Have an active subscription (30 days free trial)
        </li>
        <li>
          - in the Collection interface, create a new collection
        </li>
        <li>
          - edit the collection to your liking, adding some of the items and PCs you'd like to use in your campain
        </li>
        <li>
          - In the campain interface, click "Use for a new campain", than choose the one table you want this new campain to be available in (you must be a Game Master or Owner of the table).
        </li>
        <li>
          - play the campain, you can add new items to it while playing, and then transfer them back to the collection throught the "Exchanges" interface.
        </li>
      </ul>

    <button class="m-4 button" @click="showExpertWay=false">close this topic</button>
  </div>

</div>
</template>

<script>
export default {
  name: 'GuideView',
  components: {
  },
  data(){
    return {
      showWhatIs: false,
      showQuickWay: false,
      showExpertWay: false,
    }
  },
}
</script>

<style scoped>
p {
  word-break: keep-all;
  font-size: 1.4em;
  color: rgb(117, 117, 117);

}
/* .text {
  word-break: keep-all;
} */

.topic {
  background-color: lightseagreen;
  color: rgb(222, 222, 222);
  font-size: 1.6em;
  cursor: pointer;
  border: 1px solid rgb(106, 227, 221);
  border-radius: 5px;
}
.topic:hover {
  background-color: rgb(130, 234, 229);
  color: rgb(117, 117, 117);
}


.logo {
  display: flex;
  max-width: 30%;
}
.logo-title {
  margin-top: 20px;
  margin-right:auto;
  font-size: 4em;
  color: rgb(60, 99, 255);
}
.logo-image {
  margin-left: auto;
  width: 100px;
  height: 100px;
  margin-right: 10px;
}


</style>