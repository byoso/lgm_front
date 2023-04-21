<template>
<nav class="navbar is-fixed-top pl-2 pr-2" role="navigation" aria-label="main navigation">
  <div class="navbar-brand">
    <router-link to="/" class="navbar-item" style="font-weight: bold;">Le Grand Monde</router-link>

    <a role="button" class="navbar-burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
      <span aria-hidden="true"></span>
      <span aria-hidden="true"></span>
      <span aria-hidden="true"></span>
    </a>
  </div>

  <div id="navbarBasicExample" class="navbar-menu">
    <div class="navbar-start">


      <router-link v-if="$store.state.isAuthenticated" to="/notebooks" class="navbar-item">
        Campain books
      </router-link>


    </div>

    <div class="navbar-end">
      <div class="navbar-item">

      <div class="navbar-item has-dropdown is-hoverable" v-if="$store.state.isAuthenticated">
        <a class="navbar-link">
          Account
        </a>

        <div class="navbar-dropdown">
          <router-link to="/account" class="navbar-item">
            account informations
          </router-link>

          <router-link to="/about" class="navbar-item">
            About
          </router-link>

          <hr class="navbar-divider">
          <a class="navbar-item">
            Report an issue
          </a>
        </div>
      </div>




        <div class="buttons">
          <div v-if="!$store.state.isAuthenticated">
            <router-link class="button is-primary" to="/signup">
              <strong>Sign up</strong>
            </router-link>

            <router-link class="button is-light" to="/login">
              Log in
            </router-link>
          </div>
          <div v-else>
            <router-link class="button is-warning" @click="logout" to="/">
              Log out
            </router-link>
          </div>

        </div>
      </div>
    </div>
  </div>
</nav>
<div class="container">
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

// Add and adapt this in the lifecycle
  beforeCreate() {

    // Vuex store init
    this.$store.commit("initializeStore");
    if (this.$store.state.token) {
      axios.defaults.headers.common['Authorization'] = 'Token ' + this.$store.state.token;
    } else {
      axios.defaults.headers.common['Authorization'] = '';
    }


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

  }
}
</script>
<style lang="scss">
@import '~bulma/css/bulma.css';

html {
  background-color: #f5f5f5;
  padding: 5px;
}


</style>
