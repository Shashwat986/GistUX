<template>
<div class="container" v-if="currentPath">
  <ol class="breadcrumb">
    <li>
      <router-link to="/list">
        GistUX
      </router-link>
    </li>
    <li v-for="item in route">
      <router-link :to="'/list' + item.path">{{item.name}}</router-link>
    </li>
  </ol>
  <h2><small>Folders</small></h2>
  <div class="row">
    <div class="col-md-4 col-xs-6" v-for="(value, key) in currentPath.folders">
      <div class="panel panel-default">
        <div class="panel-heading">
          <router-link :to="getFolderUrl(key)">
            <h3 class="panel-title">{{key}}</h3>
          </router-link>
        </div>
      </div>
    </div>
  </div>
  <h2><small>Files</small></h2>
  <div class="row">
    <div class="col-md-4 col-xs-6" v-for="key in currentPath.files">
      <div class="panel panel-default">
        <div class="panel-heading">
          <h3 class="panel-title">{{key}}</h3>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import Vue from 'vue'
import VueResource from 'vue-resource'
import Spinner from './spinner.vue'

Vue.use(VueResource)

module.exports = {
  data: function () {
    return {
      route: [],
      currentPath: null
    }
  },
  computed: {
    state: function () {
      return this.$store.state;
    }
  },
  created: function () {
    if (!this.state.github.githubKey ||
        !this.state.gistux.folderJSON) {
      this.$parent.$router.push('/');
      return;
    }
    this.updateDisplayData();
  },
  methods: {
    getFolderUrl: function (key) {
      return this.$route.path + "/" + key;
    },
    updateDisplayData: function () {
      this.route = [];
      this.currentPath = null;

      let folderPath = this.$route.params.path;
      let root = this.$store.state.gistux.folderJSON.root;
      let path = "/";

      if (folderPath) {
        for (let key of folderPath.split('/')) {
          if (root.folders[key]) {
            root = root.folders[key];
            path += key
            this.route.push({
              name: key,
              path: path
            });
          } else {
            return;
          }
        }
      }
      this.currentPath = root;
    }
  },
  watch: {
    $route: 'updateDisplayData'
  }
}
</script>
