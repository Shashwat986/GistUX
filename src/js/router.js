import Vue from 'vue'
import VueRouter from 'vue-router'
import List from './views/list.vue'

Vue.use(VueRouter)

const Bar = { template: '<div>bar</div>' }

const routes = [
  {
    path: '/list/:path*',
    component: List
  }
]

const router = new VueRouter({ routes });

export default router;
