import Vue from 'vue';
import router from './router.es6.js'

var store = {
  state: {
    githubKey: null
  },
  setGithubKey (key) {
    store.state.githubKey = key;
  },
  destroySession () {
    store.state.githubKey = null;
  }
}

window.vm = {
  navbar: new Vue({
    el: '#navbar',
    router: router,
    data: {
      githubKey: null,
      store: store,
      state: store.state
    }
  }),

  content: new Vue({
    el: "#main",
    router: router,
    data: {
      store: store,
      state: store.state
    }
  })
}
