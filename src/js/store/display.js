export default {
  state: {
    recentlyCreatedFolder: null
  },
  getters: {
    isRecentlyCreatedFolder: (state) => (folderNode) => {
      if (state.recentlyCreatedFolder == null) {
        return false;
      }
      if (window.folderJSON.objectEqual(state.recentlyCreatedFolder, folderNode)) {
        return true;
      }
      return false;
    }
  },
  mutations: {
    setRecentlyCreatedFolder (state, value = null) {
      state.recentlyCreatedFolder = value;
    }
  },
  actions: {
  }
};
