import { createStore } from 'vuex'

export default createStore({
  state: {
    isloading: false,
    isAuthenticated: false,
    token: null,
    user: null,
    // The real values are set in TableView.vue
    current_table: {name: "current_table", id: "no_id"},
    current_campain: {name: "current_campain", id: "no_id"},
    prefs: {
      itemsDisplayMode: 'image', // mini, image
    },
    configuration: {},
  },
  getters: {
  },
  mutations: {
    initializeStore(state) {
      if (localStorage.getItem('store')) {
        state.token = localStorage.getItem('token');
        state.isAuthenticated = true;
      } else {
        state.token = null;
        state.isAuthenticated = false;
      }
    },
    setIsLoading(state, status) {
      state.isloading = status;
    },
    setToken(state, token) {
      state.token = token;
      state.isAuthenticated = true;
    },
    removeToken(state) {
      state.token = null;
      state.isAuthenticated = false;
    }
  },

  actions: {
  },
  modules: {
  }
})