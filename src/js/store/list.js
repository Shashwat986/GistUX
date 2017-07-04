export default {
  state: {
    showNewFolderDroppable: false
  },
  mutations: {
    setNewFolderDroppable (state, value = false) {
      state.showNewFolderDroppable = value;
    }
  }
};
