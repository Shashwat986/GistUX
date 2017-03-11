import Vue from 'vue';
import router from './router.js';
import Spinner from './views/spinner.vue';
import Navbar from './views/navbar.vue';
import store from './store.js';

window.store = store;

window.vm = {
  content: new Vue({
    el: "#main",
    router: router,
    store: store,
    computed: {
      state: function () {
        return this.$store.state;
      }
    },
    components: {
      spinner: Spinner,
      navbar: Navbar
    }
  })
}
