<template>
<nav class="navbar is-fixed-top pl-2 pr-2 is-dark" role="navigation" aria-label="main navigation">
  <div class="navbar-brand">
    <router-link to="/" class="navbar-item" style="font-weight: bold;">RPGAdventure.eu</router-link>

    <a role="button" class="navbar-burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
      <span aria-hidden="true"></span>
      <span aria-hidden="true"></span>
      <span aria-hidden="true"></span>
    </a>
  </div>

  <div id="navbarBasicExample" class="navbar-menu">
    <div class="navbar-start">
      <router-link v-if="$store.state.isAuthenticated" to="/dashboard" class="navbar-item">
        Tables
      </router-link>
      <router-link v-if="$store.state.isAuthenticated" to="/collections" class="navbar-item">
        Collections
      </router-link>
    </div>

    <div class="navbar-end">
      <div class="navbar-item">

        <div class="navbar-item has-dropdown is-hoverable" v-if="$store.state.isAuthenticated">

          <span style="color: white;">{{ user.username }} </span>

          <a class="navbar-link">
            <fa icon="user"/>
          </a>

          <div class="navbar-dropdown">
            <router-link to="/account" class="navbar-item">
              account informations
            </router-link>

            <hr class="navbar-divider">
            <router-link to="/about" class="navbar-item">
              About
            </router-link>

            <a class="navbar-item" href="https://github.com/byoso/lgm_front/issues" target="_blank">
              Report an issue
            </a>
          </div>
        </div>




        <div class="buttons">
          <div v-if="!$store.state.isAuthenticated">
            <router-link class="button is-primary is-small" to="/signup">
              <strong>Sign up</strong>
            </router-link>

            <router-link class="button is-light is-small" to="/login">
              Log in
            </router-link>
          </div>
          <div v-else>
            <router-link class="button is-warning is-small" @click="logout" to="/">
              Log out
            </router-link>
          </div>

        </div>
      </div>
    </div>
  </div>
</nav>
<div>
  <router-view/>
</div>

</template>

<script>

import axios from 'axios';
// import store from './store';

export default {
  name: 'App',
  methods: {
    logout() {
      this.$store.commit('removeToken');
    }
  },
  computed: {
    user() {
      return this.$store.state.user;
    }
  },

// Add and adapt this in the lifecycle
  beforeCreate() {

    // Vuex store init
    this.$store.commit("initializeStore");
    if (this.$store.state.token) {
      axios.defaults.headers.common['Authorization'] = 'Token ' + this.$store.state.token;
    } else {
      axios.defaults.headers.common['Authorization'] = '';
    }
    this.user = this.$store.state.user;

    // Bulma - navbar burger
    document.addEventListener('DOMContentLoaded', () => {
      const $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);
      $navbarBurgers.forEach( el => {
        el.addEventListener('click', () => {
          const target = el.dataset.target;
          const $target = document.getElementById(target);
          el.classList.toggle('is-active');
          $target.classList.toggle('is-active');
        });
      });
    });

  },
  mounted() {
    document.title = 'RPGAdventure.eu'
  },
}
</script>
<style lang="scss">
@import '~bulma/css/bulma.css';

html {
  background-color: #dbe2ea;
  padding: 5px;
  margin-top: 40px;
}


</style>
