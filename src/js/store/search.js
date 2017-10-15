import Vue from 'vue';

export default {
  state: {
    processedIds: [],
    searchHash: {},
    languageHash: {},
    privacyHash: {},
  },
  getters: {
    filteredLanguageHash (state, getters, rootState) {
      return (node) => {
        const languages = new Set();
        window.folderJSON.getFiles(node).forEach((elem) => {
          const val = getters.idObjectMapping.get(elem.model.uuid);
          for (const key in val.files) {
            languages.add(val.files[key].language);
          }
        });

        return Array.from(languages);
      }
    }
  },
  mutations: {
    updateLanguageHash (state, val) {
      for (const key in val.files) {
        const obj = val.files[key];
        const langIDs = state.languageHash[obj.language] || [];

        langIDs.push(val.id);
        Vue.set(state.languageHash, obj.language, langIDs);
      }
    },
    updatePrivacyHash (state, val) {
      const privacy = (val.public ? 'public' : 'private');
      const privIDs = state.privacyHash[privacy] || [];

      privIDs.push(val.id);
      Vue.set(state.privacyHash, privacy, privIDs);
    },
    updateSearchHash (state, val) {
      // TODO
      // But we don't have file contents
    }
  },
  actions: {
    updateSearch (context) {
      const gistData = context.rootState.gistux.gistData;
      gistData.forEach((val) => {
        if (context.state.processedIds.includes(val.id)) {
          return;
        }

        context.commit('updateLanguageHash', val);
        context.commit('updatePrivacyHash', val);
      });
    }
  }
};
