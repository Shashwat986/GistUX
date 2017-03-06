function NotLoggedInException () {
  this.message = "No signed in user.";
  this.name = 'NotLoggedInException';
}

const commentMessage = "";
const gistUXDescription = "";

export default {
  state: {
    gistData: null,
    folderJSON: null,
    folderJSONObjectID: null,
    gistUXFileName: null
  },
  getters: {
    gistUXFileName (state, getters, rootState) {
      if (!rootState.github.ghUserData) throw new NotLoggedInException();
      let userData = rootState.github.ghUserData;

      return `GistUX_${userData.login}.json`;
    },
    currentlyExistingFileIDs (state) {
      return state.gistData.map(function (val) {
        return val.id;
      });
    }
  },
  mutations: {
    setGistData (state, data = null) {
      state.gistData = data;
    },
    setFolderJSON (state, data = null) {
      if (data) {
        if (!data._comment) {
          data._comment = commentMessage;
        }
      }
      state.folderJSON = data;
    },
    setFolderJSONObjectID (state, id = null) {
      state.folderJSONObjectID = id;
    }
  },
  actions: {
    setGistData (context, data) {
      context.commit('setGistData', data);

      if (!context.state.folderJSON) {
        const fileName = context.getters.gistUXFileName;
        const folderJSONObject = context.state.gistData.find(function (val) {
          return Object.keys(val.files)[0] == fileName;
        });

        if (folderJSONObject) {
          context.commit('setFolderJSONObjectID', folderJSONObject.id);
          context.dispatch('fetchGistContent', folderJSONObject.id).then(function (resp) {
            const fileContent = resp.data.files[fileName].content;
            context.dispatch('updateFolderJSON', JSON.parse(fileContent));
          });
        } else {
          context.dispatch('updateFolderJSON');
        }
      }
    },
    updateFolderJSON (context, jsonData = undefined) {
      let changed = false;
      if (!context.state.folderJSON) {
        if (jsonData) {
          context.commit('setFolderJSON', jsonData);
        } else {
          context.commit('setFolderJSON', {
            root: {
              // Deep Copy because mutating this shouldn't affect originally fetched data
              files: context.getters.currentlyExistingFileIDs.slice(0)
            }
          });
          changed = true;
        }
      } else {
        if (jsonData) {
          context.commit('setFolderJSON', jsonData);
          changed = true;
        } else {
          // INCOMPLETE?
        }
      }

      if (changed) {
        context.dispatch(
          'writeGistContent',
          {
            gistID: context.state.folderJSONObjectID,
            content: {
              description: gistUXDescription,
              public: false,
              files: {
                [context.getters.gistUXFileName]: {
                  content: JSON.stringify(context.state.folderJSON, null, 2)
                }
              }
            }
          }
        );
      }
    }
  }
}
