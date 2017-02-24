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

window.vm = new Vue({
  el: '#navbar',
  data: {
    githubKey: null,
    store: store,
    state: store.state
  }
})
