import { createStore } from 'vuex'

export default createStore({
  state: {
    isloading: false,
    isAuthenticated: false,
    token: null,
    user: {},
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
      if (localStorage.getItem('token') && localStorage.getItem('isAuthenticated') && localStorage.getItem('user')) {
        state.token = localStorage.getItem('token');
        state.isAuthenticated = localStorage.getItem('isAuthenticated');
        state.isAuthenticated = true;
        state.user = JSON.parse(localStorage.getItem('user'));
        state.current_table = JSON.parse(localStorage.getItem('current_table'));
        state.current_campain = JSON.parse(localStorage.getItem('current_campain'));

      } else {
        state.token = null;
        state.isAuthenticated = false;
        state.user = {};
      }
    },
    setIsLoading(state, status) {
      state.isloading = status;
    },
    setUser(state, user) {
      state.user = user;
      localStorage.setItem('user', JSON.stringify(user));
    },
    removeUser(state) {
      state.user = {};
      localStorage.removeItem('user');
    },
    setToken(state, token) {
      state.token = token;
      state.isAuthenticated = true;
      localStorage.setItem('token', token);
      localStorage.setItem('isAuthenticated', true);
    },
    removeToken(state) {
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
      localStorage.removeItem('isAuthenticated');
    },
    setCurrentTable(state, table) {
      state.current_table = table;
      localStorage.setItem('current_table', JSON.stringify(table));
    },
    removeCurrentTable(state) {
      state.current_table = {};
      localStorage.removeItem('current_table');
    },
    setCurrentCampain(state, campain) {
      state.current_campain = campain;
      localStorage.setItem('current_campain', JSON.stringify(campain));
    },
    removeCurrentCampain(state) {
      state.current_campain = {};
      localStorage.removeItem('current_campain');
    }
  },

  actions: {
  },
  modules: {
  }
})