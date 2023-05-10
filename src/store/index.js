import { createStore } from 'vuex'

export default createStore({
  state: {
    isloading: false,
    isAuthenticated: false,
    token: null,
    user: null,
    // placeholder, the real current_table is set in TableView.vue
    current_table: {name: "current_table", id: "no_id"}
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