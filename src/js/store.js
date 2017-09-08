/* eslint global-require: "off" */
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    github: require('./store/github.js').default,
    spinner: require('./store/spinner.js').default,
    banner: require('./store/banner.js').default,
    gistux: require('./store/gistux.js').default
  }
});

export default store;
