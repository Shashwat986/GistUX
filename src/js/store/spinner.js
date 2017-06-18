export default {
  state: {
    showSpinner: false,
    spinnerMessage: null
  },
  mutations: {
    showSpinner (state, message = '') {
      state.spinnerMessage = message;
      state.showSpinner = true;
    },
    hideSpinner (state) {
      state.showSpinner = false;
    }
  }
};
