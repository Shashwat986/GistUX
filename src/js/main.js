import Vue from 'vue';
import router from './router.js'
import Spinner from './views/spinner.vue'
import store from './store.js'

window.store = store;

window.vm = {
  navbar: new Vue({
    el: '#navbar',
    router: router,
    data: {
      githubKey: null,
      store: window.store,
      state: window.store.state
    }
  }),

  content: new Vue({
    el: "#main",
    router: router,
    data: {
      store: window.store,
      state: window.store.state
    },
    components: {
      spinner: Spinner
    }
  })
}
