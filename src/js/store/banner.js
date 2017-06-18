export default {
  state: {
    error: null,
    success: null
  },
  mutations: {
    setSuccess (state, message = null) {
      state.success = message;
    },
    setError (state, message = null) {
      state.error = message;
    }
  },
  actions: {
    setSuccess (context, message = null) {
      context.commit('setSuccess', message);
      setTimeout(() => {
        context.commit('setSuccess');
      }, 3000);
    },
    setError (context, message = null) {
      context.commit('setError', message);
      setTimeout(() => {
        context.commit('setError');
      }, 5000);
    }
  }
};
