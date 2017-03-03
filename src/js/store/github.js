import Vuex from 'vuex'
import GitHub from 'github-api';

export default {
  state: {
    githubKey: null,
    gh: new GitHub(),
    gistUXData: null,
    ghUser: null
  },
  mutations: {
    setGithubKey (state, key) {
      state.githubKey = key;
      state.gh = new GitHub({token: key});
      state.ghUser = state.gh.getUser();
    },
    destroySession (state) {
      state.githubKey = null;
      state.gh = null;
      state.ghUser = null;
    },
    setUser (state, user) {
      state.ghUser = user;;
    },
    setGistUXData (state, data) {
      state.gistUXData = data;
    }
  },
  actions: {
    setUser (context) {
      user = context.state.gh.getUser()
      context.commit('setUser', user);
    },
    setGithubKey (context, key) {
      context.commit('setGithubKey', key);
      context.dispatch('loadGistUXData');
    },
    loadGistUXData (context) {
      context.commit('showSpinner', 'Fetching Data');

      if (!context.state.ghUser) {
        if (!context.state.gh)
          return;
        context.dispatch('getUser');
      }

      // This is a hack to get all gists
      let url = context.state.ghUser.__getScopedUrl('gists');
      context.state.ghUser._requestAllPages(url).then(function (resp) {
        context.dispatch('setSuccess', "Logged in Successfully");
        context.commit('setGistUXData', resp.data);
        context.commit('hideSpinner');
      }).catch(function (e) {
        context.dispatch('setError', "Invalid Authentication Key");
        context.commit('destroySession');
        context.commit('hideSpinner');
      });
    }
  }
}
