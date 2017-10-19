import Vue from 'vue';
import router from './router';
import Spinner from './views/spinner.vue';
import Navbar from './views/navbar.vue';
import Banners from './views/banners.vue';
import store from './store';
import constants from './constants';
import FolderModel from './folder_model';

window.store = store;

window.folderJSON = new FolderModel();

window.vm = new Vue({
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
    navbar: Navbar,
    banners: Banners,
  },
  methods: {
    setGithubKey (githubKey) {
      this.$store.dispatch('setGithubKey', githubKey).then(() => {
        if (this.$router.currentRoute.path === '/') {
          this.$router.push('/list');
        }
      });
    }
  },
  created () {
    const key = window.localStorage.getItem(constants.localStorageKey);
    if (key) {
      this.setGithubKey(key);
    }
  }
});
