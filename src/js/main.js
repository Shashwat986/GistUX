import Vue from 'vue';
import router from './router';
import Spinner from './views/spinner.vue';
import Navbar from './views/navbar.vue';
import store from './store';
import constants from './constants';

window.store = store;

window.vm = {
  content: new Vue({
    el: '#main',
    router,
    store,
    computed: {
      state () {
        return this.$store.state;
      }
    },
    components: {
      spinner: Spinner,
      navbar: Navbar
    },
    methods: {
      setGithubKey (githubKey) {
        this.$store.dispatch('setGithubKey', githubKey).then(() => {
          this.$router.push('/list');
        });
      }
    },
    created () {
      const key = window.localStorage.getItem(constants.localStorageKey);
      if (key) {
        this.setGithubKey(key);
      }
    }
  })
};
