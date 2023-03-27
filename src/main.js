import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { fas } from '@fortawesome/free-solid-svg-icons'

import axios from 'axios'

// this url is for a django backend
axios.defaults.baseURL = 'http://127.0.0.1:8000'

// add icons to the library
library.add(fas)
// add the components to the app
createApp(App).component('fa', FontAwesomeIcon).use(store).use(router, axios)
.mount('#app')
// createApp(App).use(store).use(router, axios)
// .mount('#app')
// createApp(App).use(store).use(router).mount('#app')
