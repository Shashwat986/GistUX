import Vue from 'vue';
import VueRouter from 'vue-router';
import store from './store';
import List from './views/list.vue';
import Config from './views/config.vue';

Vue.use(VueRouter);

const checkLogin = (to, from, next) => {
  const state = store.state;
  if (!state.github.githubKey ||
      window.folderJSON.isEmpty()) {
    next(false);
  } else {
    next();
  }
}

const routes = [
  {
    path: '',
    beforeEnter (to, from, next) {
      const state = store.state;
      if (state.github.githubKey &&
          !window.folderJSON.isEmpty()) {
        next('/list');
      } else {
        next();
      }
    }
  },
  {
    path: '/list/:path*',
    component: List,
    beforeEnter: checkLogin
  },
  {
    path: '/config',
    component: Config,
    beforeEnter: checkLogin
  }
];

const router = new VueRouter({ routes });

export default router;
