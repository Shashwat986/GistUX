function NotLoggedInException () {
  this.message = "No signed in user.";
  this.name = 'NotLoggedInException';
}
import FolderModel from './folder_model.js';

const commentMessage = "";
const gistUXDescription = "";

export default {
  state: {
    gistData: null,
    folderJSON: new FolderModel(),
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
    },
    idObjectMapping (state) {
      return new Map(
        state.gistData.map(function(val) {
          return [val.id, val];
        })
      );
    }
  },
  mutations: {
    setGistData (state, data = null) {
      state.gistData = data;
    },
    setFolderJSON (state, data = null) {
      state.folderJSON.setData(data);
    },
    addFilesToFolderJSON(state, files) {
      state.folderJSON.addFiles(files);
    },
    setFolderJSONObjectID (state, id = null) {
      state.folderJSON.objectID = id;
    }
  },
  actions: {
    setGistData (context, data) {
      context.commit('setGistData', data);

      if (context.state.folderJSON.isEmpty()) {
        const fileName = context.getters.gistUXFileName;
        const folderJSONObject = context.state.gistData.find(function (val) {
          return Object.keys(val.files)[0] == fileName;
        });

        if (folderJSONObject) {
          context.commit('setFolderJSONObjectID', folderJSONObject.id);

          context.commit('showSpinner', 'Fetching current folder structure');
          return context.dispatch('fetchGistContent', folderJSONObject.id).then(function (resp) {
            const fileContent = resp.data.files[fileName].content;
            context.dispatch('updateFolderJSON', JSON.parse(fileContent));
          });
        } else {
          return context.dispatch('updateFolderJSON');
        }
      }
    },
    updateFolderJSON (context, jsonData = undefined) {
      let changed = false;
      if (context.state.folderJSON.isEmpty()) {
        if (jsonData) {
          // If config file exists and no data in $store
          // Copy config content to $store

          //TODO: Add new files to root folder
          context.commit('setFolderJSON', jsonData);
        } else {
          // If config file doesn't exist and no data in $store
          // Create new $store. Write to config file

          context.commit(
            'addFilesToFolderJSON',
            context.getters.currentlyExistingFileIDs
          );
          changed = true;
        }
      } else {
        if (jsonData) {
          // If config file exists and data in $store
          // Overwrite data

          context.commit('setFolderJSON', jsonData);
          changed = true;
        } else {
          // If config file doesn't exist and data in $store
          // Write to config file

          changed = true;
        }
      }

      if (changed) {
        context.dispatch(
          'writeGistContent',
          {
            gistID: context.state.folderJSON.objectID,
            content: {
              description: gistUXDescription,
              public: false,
              files: {
                [context.getters.gistUXFileName]: {
                  content: context.state.folderJSON.asJSON()
                }
              }
            }
          }
        ).then(function () {
          context.commit('setGistPermission', true);
        }, function (err) {
          context.dispatch('setError', 'Unable to save GistUX file. Have you provided gist access in the generated token?');
          context.commit('setGistPermission', false);
        });
      }
    }
  }
}
