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
  <p class="bg-warning text-center" v-if="state.github.ghGistPermission === false">
    Please note that GistUX does not have write permissions to your gists. This tool may not have access to your private gists, and all changes made here will not be saved.
    <br/>
    Fix this by <a href="https://github.com/settings/tokens" target="_blank">regenerating your Github Token</a> and giving it the <i>gist</i> permission.
  </p>
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
    <template v-for="(item, index) in currentPath.files">
      <div class="col-xs-12 visible-xs-block visible-sm-block clearfix" v-if="index % 2 == 0"></div>
      <div class="col-md-12 visible-md-block visible-lg-block clearfix" v-if="index % 3 == 0"></div>
      <file-item :key="item" :fileId="item"></file-item>
    </template>
  </div>
</div>
</template>

<style>
p.bg-warning {
  padding: 10px;
}
</style>

<script>
import FileItem from './file_item.vue'

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
      return (this.$route.params.path || "/list") + "/" + key;
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
  },
  components: {
    "file-item": FileItem
  }
}
</script>
