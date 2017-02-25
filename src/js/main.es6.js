import Vue from 'vue';

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
    data: {
      githubKey: null,
      store: store,
      state: store.state
    }
  }),

  content: new Vue({
    el: "#main",
    data: {
      store: store,
      state: store.state
    }
  })
}
