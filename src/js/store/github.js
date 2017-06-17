import GitHub from 'github-api';
import constants from '../constants.js'

export default {
  state: {
    githubKey: null,
    gh: null,
    ghUser: null,
    ghUserData: null,
    ghGistPermission: null
  },
  mutations: {
    setGithubKey (state, key) {
      if (!key) return;
      if (typeof key == 'String' && key.length == 0) return;

      state.githubKey = key;
      window.localStorage.setItem(constants.localStorageKey, key);
      state.gh = new GitHub({token: key});
      state.ghUser = state.gh.getUser();
    },
    destroySession (state) {
      state.githubKey = null;
      window.localStorage.removeItem(constants.localStorageKey);
      state.gh = null;
      state.ghUser = null;
      state.ghUserData = null;
    },
    setUser (state, user) {
      state.ghUser = user;
    },
    setUserData (state, userData) {
      state.ghUserData = userData;
    },
    setGistPermission(state, val) {
      state.ghGistPermission = !!val;
    }
  },
  actions: {
    setGithubKey (context, key) {
      context.commit('setGithubKey', key);
      return context.dispatch('loadGistData');
    },
    loadGistData (context) {
      if (!context.state.gh) return;

      context.commit('showSpinner', 'Fetching User Data');

      if (!context.state.ghUser) {
        context.commit('setUser', context.state.gh.getUser());
      }

      // This is a hack to get all gists
      let url = context.state.ghUser.__getScopedUrl('gists');
      let pagesPromise = context.state.ghUser._requestAllPages(url);

      let userDataPromise = context.state.ghUser.getProfile();

      return Promise.all([userDataPromise, pagesPromise]).then(function (values) {
        context.commit('showSpinner', 'Processing fetched pages');
        context.commit('setUserData', values[0].data);
        return context.dispatch('setGistData', values[1].data);
      }, function (e) {
        context.dispatch('setError', "Invalid Authentication Key");
        context.commit('destroySession');
        context.commit('hideSpinner');
      }).then(function () {
        context.dispatch('setSuccess', "Logged in Successfully");
        context.commit('hideSpinner');
      });
    },
    fetchGistContent (context, gistID = undefined) {
      let gistObj = context.state.gh.getGist(gistID);

      // Returns Promise
      // TODO: Currently this doesn't deal with `truncated` flag.
      return gistObj.read();
    },
    writeGistContent (context, { gistID, content }) {
      let gistObj = context.state.gh.getGist(gistID);
      if (gistID) {
        return gistObj.update(content);
      } else {
        return gistObj.create(content);
      }
    }
  }
}
