import Vue from 'vue';
import store from './store';
import VueRouter from 'vue-router';
import List from './views/list.vue';
import Config from './views/config.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/list/:path*',
    component: List,
    beforeEnter (to, from, next) {
      const state = store.state;
      if (!state.github.githubKey ||
          state.gistux.folderJSON.isEmpty()) {
        next(false);
      } else {
        next();
      }
    }
  },
  {
    path: "/config",
    component: Config
  }
];

const router = new VueRouter({ routes });

export default router;
