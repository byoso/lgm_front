<template>
<div>
<nav class="navbar is-fixed-top pl-2 pr-2 is-dark" role="navigation" aria-label="main navigation">
  <div class="navbar-brand">
    <router-link to="/" class="navbar-item" style="font-weight: bold;" @click="burgerIsActive=false">
      <img src="favicon.ico" alt="short-logo" class="mr-2">
      RPGAdventure.eu
    </router-link>

    <a role="button" class="navbar-burger"
    :class="{'is-active': burgerIsActive}"
    @click="toggleBurger()"
    aria-label="menu" :aria-expanded="false" data-target="navbarBasicExample">
      <span aria-hidden="true"></span>
      <span aria-hidden="true"></span>
      <span aria-hidden="true"></span>
    </a>
  </div>

  <div id="navbarBasicExample" class="navbar-menu"
  :class="{'is-active': burgerIsActive}" @click="burgerIsActive=false">
    <div class="navbar-start" v-if="$store.state.user" >
      <router-link v-if="$store.state.isAuthenticated" to="/dashboard" class="navbar-item">
        Tables
      </router-link>
      <router-link v-if="$store.state.isAuthenticated" to="/collections"
      class="navbar-item is-hidden-mobile">
        Collections
      </router-link>
        <router-link v-if="$store.state.isAuthenticated & $store.state.user.is_subscriber"
        class="navbar-item is-hidden-mobile"
        :to="{ name: 'exchangesView' }"
        >
          Exchanges
        </router-link>
    </div>

    <div class="navbar-end">
      <div class="navbar-item">
        <div v-if="$store.state.user">
          <router-link v-if="$store.state.isAuthenticated & !$store.state.user.is_subscriber & open_subscriptions"
            class="button is-primary is-small mr-5" :to="{name: 'subscriptionsView'}">
            <strong>Subscribe</strong>
          </router-link>

        </div>

        <div class="navbar-item has-dropdown is-hoverable" v-if="$store.state.isAuthenticated">

          <a class="navbar-link">
            {{ user.username }}
            <fa icon="user" class="ml-2"/>
          </a>

          <div class="navbar-dropdown">
            <router-link to="/account" class="navbar-item">
              account informations
            </router-link>

            <hr class="navbar-divider">
            <router-link :to="{name: 'about'}" class="navbar-item">
              About
            </router-link>

            <a class="navbar-item is-hidden-mobile" href="https://github.com/byoso/lgm_front/issues" target="_blank">
              Report an issue
            </a>
          </div>
        </div>

        <div class="buttons">
          <div v-if="!$store.state.isAuthenticated">
            <router-link v-if="open_subscriptions"
            class="button is-primary is-small" to="/signup">
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

<div class="bottom">
</div>

</div>
</template>

<script>

import axios from 'axios';

export default {
  name: 'App',
  data(){
    return {
      burgerIsActive: false,
      open_subscriptions: false,
    }
  },
  methods: {
    logout() {
      this.$store.commit('removeToken');
    },
    toggleBurger(){
      this.burgerIsActive = !this.burgerIsActive;
    },
  },
  computed: {
    user() {
      return this.$store.state.user;
    }
  },

// Default axios headers
  beforeCreate() {

    // Vuex store init
    this.$store.commit("initializeStore");
    if (this.$store.state.token) {
      axios.defaults.headers.common['Authorization'] = 'Token ' + this.$store.state.token;
    } else {
      axios.defaults.headers.common['Authorization'] = '';
    }
    this.user = this.$store.state.user;

    // check if subscriptions are open
    axios({
      method: 'get',
      url: '/dsap/configuration/',
    }).then((response) => {
      this.$store.state.configuration = response.data;
      this.open_subscriptions = this.$store.state.configuration.open_subscriptions;
    }).catch((error) => {
      console.log(error);
    })

  },
  beforeMount(){
  },
  mounted() {
    document.title = 'RPGAdventure.eu'
  },
}
</script>
<style lang="scss">
@import '~bulma/css/bulma.css';

html {
  background-color: #a4ffa2;
  padding: 5px;
  margin-top: 40px;
}

router-link {
  text-decoration: none;
  color: white;
}

router-link:visited {
  text-decoration: none;
  color: white;
}
router-link:hover {
  text-decoration: none;
  color: white;
}

.bottom {
  margin-top: 100px;
}


</style>
