<template>
<nav class="navbar" role="navigation" aria-label="main navigation">
  <!-- <div class="navbar-brand">
    <router-link to="/" class="navbar-item" style="font-weight: bold;">Le Grand Monde</router-link>

    <a role="button" class="navbar-burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
      <span aria-hidden="true"></span>
      <span aria-hidden="true"></span>
      <span aria-hidden="true"></span>
    </a>
  </div> -->

  <div id="navbarBasicExample" class="navbar-menu">
    <div class="navbar-start">
      <!-- <router-link to="/about" class="navbar-item">
        Lore
      </router-link>

      <router-link to="/about" class="navbar-item">
        Creation de personnage
      </router-link> -->

      <router-link to="/notebooks" class="navbar-item">
        Carnets de campagne
      </router-link>

      <div class="navbar-item has-dropdown is-hoverable">
        <a class="navbar-link">
          Plus
        </a>

        <div class="navbar-dropdown">
          <router-link to="/about" class="navbar-item">
            à propos
          </router-link>

          <a class="navbar-item">
            Contact
          </a>
          <hr class="navbar-divider">
          <a class="navbar-item">
            Signaler un problème
          </a>
        </div>
      </div>
    </div>

    <div class="navbar-end">
      <div class="navbar-item">
        <div class="buttons">
          <a class="button is-primary">
            <strong>Sign up</strong>
          </a>
          <a class="button is-light">
            Log in
          </a>
        </div>
      </div>
    </div>
  </div>
</nav>
  <router-view/>
</template>

<script>

import axios from 'axios';

export default {
  name: 'App',

// Add and adapt this in the lifecycle
  beforeCreate() {
    this.$store.commit("initializeStore");
    if (this.$store.state.token) {
      axios.defaults.header.common['Authorization'] = 'Token' + this.$store.state.token;
    } else {
      axios.defaults.headers.common['Authorization'] = '';
    }
  }
}
</script>
<style lang="scss">
@import '~bulma/css/bulma.css';

</style>
