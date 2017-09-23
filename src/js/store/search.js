import Vue from 'vue';

export default {
  state: {
    processedIds: [],
    searchHash: {},
    languageHash: {}
  },
  mutations: {
    updateLanguageHash (state, val) {
      for (const key in val.files) {
        const obj = val.files[key];
        let langIDs = state.languageHash[obj.language];

        if (langIDs === undefined) {
          langIDs = [];
        }

        langIDs.push(val.id);
        Vue.set(state.languageHash, obj.language, langIDs);
      }
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
      });
    }
  }
};
