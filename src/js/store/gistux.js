import FolderModel from './folder_model';

function NotLoggedInException () {
  this.message = 'No signed in user.';
  this.name = 'NotLoggedInException';
}

const gistUXDescription = '';

export default {
  state: {
    gistData: [],
    folderJSON: new FolderModel(),
    gistUXFileName: null
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
    setFolderJSON (state, data = null) {
      state.folderJSON.setData(data);
    },
    addFilesToFolderJSON (state, files, node = null) {
      state.folderJSON.addFiles(files, node);
    },
    setFolderJSONConfigFileID (state, id = null) {
      state.folderJSON.objectID = id;
    }
  },
  actions: {
    setGistData (context, data) {
      context.commit('setGistData', data);

      if (context.getters.gistUXFileName === null)
        throw new NotLoggedInException();

      if (context.state.folderJSON.isEmpty()) {
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

      context.commit('setFolderJSONConfigFileID', folderJSONConfigFile.id);
      context.commit('showSpinner', 'Fetching current folder structure');

      return context.dispatch('fetchGistContent', folderJSONConfigFile.id).then((resp) => {
        const fileContent = resp.data.files[context.getters.gistUXFileName].content;
        context.dispatch('updateFolderJSON', JSON.parse(fileContent));
      });
    },
    updateFolderJSON (context, jsonData = undefined) {
      if (jsonData) {
        // If data needs to be updated from config file data
        // Copy config content to $store

        // TODO: Add new files to root folder
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
      ).then(() => {
        context.commit('setGistPermission', true);
      }, () => {
        context.dispatch('setError', 'Unable to save GistUX file. Have you provided gist access in the generated token?');
        context.commit('setGistPermission', false);
      });
    }
  }
};
