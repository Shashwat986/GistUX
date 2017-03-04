function NotLoggedInException () {
  this.message = "No signed in user.";
  this.name = 'NotLoggedInException';
}


export default {
  state: {
    gistData: null,
    folderJSON: null,
    folderData: null,
    gistUXFileName: null
  },
  getters: {
    gistUXFileName (state, getters, rootState) {
      if (!rootState.github.ghUserData) throw new NotLoggedInException();
      let userData = rootState.github.ghUserData;

      return `GistUX_${userData.login}.json`;
    }
  },
  mutations: {
    setGistData (state, data = null) {
      state.gistData = data;
    },
    setFolderJSON (state, data = null) {
      state.folderJSON = data;
    },
    setFolderData (state, data = null) {
      state.folderData = data;
    },
    updateFolderData (state) {
      if (!state.folderJSON) {
        state.folderData = {
          root: {
            // Deep Copy because mutating this shouldn't affect originally fetched data
            files: state.gistData.slice(0)
          }
        };
      } else {
        let gistDataIDs = context.state.gistData.map(function (val) {
          return val.id;
        });

        // INCOMPLETE
      }
    }
  },
  actions: {
    setGistData (context, data) {
      context.commit('setGistData', data);
      context.dispatch('checkFolderJSON');
      context.commit('updateFolderData');
    },
    checkFolderJSON (context) {
      if (!context.state.gistData) throw new NotLoggedInException();
      if (!context.state.folderJSON) {
        let folderJSON = context.state.gistData.find(function (val) {
          return Object.keys(val.files)[0] == context.getters.gistUXFileName;
        });

        context.commit('setFolderData', folderJSON);
      }
    }
  }
}
