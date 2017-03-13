import Vue from 'vue';
import router from './router.js';
import Spinner from './views/spinner.vue';
import Navbar from './views/navbar.vue';
import store from './store.js';
import constants from './constants.js'

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
    },
    methods: {
      setGithubKey: function (githubKey) {
        let that = this;
        this.$store.dispatch('setGithubKey', githubKey).then(function () {
          that.$router.push('/list');
        });
      }
    },
    created: function () {
      let key = window.localStorage.getItem(constants.localStorageKey);
      if (key) {
        this.setGithubKey(key);
      }
    }
  })
}
