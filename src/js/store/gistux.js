import { difference } from '../util/string';

function NotLoggedInException () {
  this.message = 'No signed in user.';
  this.name = 'NotLoggedInException';
}

const gistUXDescription = '';

export default {
  state: {
    gistData: [],
    gistUXFileName: null,
    mutationReturnValue: null,
    folderJSONChanged: false
  },
  getters: {
    gistUXFileName (state, getters, rootState) {
      if (!rootState.github.ghUserData) return null;
      const userData = rootState.github.ghUserData;

      return `GistUX_${userData.login}.json`;
    },
    currentlyExistingFileIDs (state) {
      return state.gistData.map((val) => val.id);
    },
    idObjectMapping (state) {
      return new Map(
        state.gistData.map((val) => [val.id, val])
      );
    },
    folderJSONConfigFile (state, getters) {
      const fileName = getters.gistUXFileName;

      return state.gistData.find((val) => {
        return Object.keys(val.files)[0] === fileName;
      });
    }
  },
  mutations: {
    setGistData (state, data = null) {
      state.gistData = data;
    },
    addElementToGistData (state, elem) {
      state.gistData.push(elem);
    },
    folderJSONChanged (state) {
      state.folderJSONChanged = true;
    },
    folderJSONChangeConsumed (state) {
      state.folderJSONChanged = false;
    },
    setFolderJSON (state, data = null) {
      window.folderJSON.setData(data);
      state.folderJSONChanged = true;
    },
    addFilesToFolderJSON (state, files) {
      window.folderJSON.addFiles(files, null);
      state.folderJSONChanged = true;
    },
    addFolderToFolderJSON (state, payload) {
      const { folderName, node } = payload;
      const response = window.folderJSON.addFolder(folderName, node);
      state.folderJSONChanged = true;
      state.mutationReturnValue = response;
    },
    folderJSONmoveFile (state, payload) {
      const { fileNode, folder } = payload;
      window.folderJSON.move(fileNode, folder);
      state.folderJSONChanged = true;
    },
    setFolderJSONConfigFileID (state, id = null) {
      window.folderJSON.objectID = id;
    }
  },
  actions: {
    setGistData (context, data) {
      context.commit('setGistData', data);
      context.dispatch('updateSearch');

      if (context.getters.gistUXFileName === null) {
        throw new NotLoggedInException();
      }

      if (window.folderJSON.isEmpty()) {
        const folderJSONConfigFile = context.getters.folderJSONConfigFile;

        if (folderJSONConfigFile) {
          // If there is an existing config file
          return context.dispatch('fetchConfigAndUpdateFolderJSON');
        }

        // If we didn't find a config file
        return context.dispatch('updateFolderJSON').then(() => {
          context.dispatch('updateGistUXConfig');
        });
      }

      // If we have an existing folderJSON object when this is called
      // Do nothing
      return Promise.resolve(null);
    },
    fetchConfigAndUpdateFolderJSON (context) {
      const folderJSONConfigFile = context.getters.folderJSONConfigFile;

      context.commit('showSpinner', 'Fetching current folder structure');

      return context.dispatch('fetchGistContent', folderJSONConfigFile.id).then((resp) => {
        const fileContent = resp.data.files[context.getters.gistUXFileName].content;
        if (!window.folderJSON.validateFile(fileContent)) {
          context.dispatch('setError', 'Invalid GistUX file found. Do you have another file with the same name?');
          return Promise.reject();
        }
        context.dispatch('updateFolderJSON', JSON.parse(fileContent));
        context.commit('setFolderJSONConfigFileID', folderJSONConfigFile.id);

        // Add new files to root folder
        const extraFiles = difference(
          context.getters.currentlyExistingFileIDs,
          window.folderJSON.allFiles()
        );

        if (extraFiles.length > 0) {
          context.commit(
            'addFilesToFolderJSON',
            extraFiles
          );
          context.dispatch('updateGistUXConfig');
        }
      });
    },
    updateFolderJSON (context, jsonData = undefined) {
      if (jsonData) {
        // If data needs to be updated from config file data
        // Copy config content to $store

        context.commit('setFolderJSON', jsonData);
      } else {
        // If config file doesn't exist and no data in $store
        // Create new $store.

        context.commit(
          'addFilesToFolderJSON',
          context.getters.currentlyExistingFileIDs
        );
      }
    },
    updateGistUXConfig (context) {
      return context.dispatch(
        'writeGistContent',
        {
          gistID: window.folderJSON.objectID,
          content: {
            description: gistUXDescription,
            public: false,
            files: {
              [context.getters.gistUXFileName]: {
                content: window.folderJSON.asJSON()
              }
            }
          }
        }
      ).then(() => {
        context.commit('setGistPermission', true);
      }, () => {
        context.dispatch('setError', 'Unable to save GistUX file. Have you provided gist access in the generated token?');
        context.commit('setGistPermission', false);
      });
    },
    getGistDataAndUpdateMap (context, gistID) {
      return context.dispatch('fetchGistContent', gistID).then((data) => {
        context.commit('addElementToGistData', data.data);
        context.dispatch('updateSearch');
      });
    }
  }
};
