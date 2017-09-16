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
    <br />
    If you wish to go ahead with this, you may import/export your temporary config file from <router-link to="/config">here</router-link>
  </p>
  <h2><small>Folders</small></h2>
  <div class="row">
    <template v-for="(node, index) in folderJSON.getFolders(currentPath)">
      <div class="col-xs-12 visible-xs-block visible-sm-block clearfix" v-if="index % 2 == 0"></div>
      <div class="col-md-12 visible-md-block visible-lg-block clearfix" v-if="index % 3 == 0"></div>
      <folder-item :key="index" :folder="node" :current-path="currentPath"></folder-item>
    </template>
    <folder-item key="new" folder="new" :current-path="currentPath"></folder-item>
  </div>
  <h2><small>Files</small></h2>
  <div class="row">
    <div class="col-md-12 filters-nav">
    <ul class="nav nav-pills pull-right col-md-12">
      <li role="presentation"><a href="#">Profile</a></li>
    </ul>
    </div>
  </div>
  <div class="row">
    <template v-for="(item, index) in folderJSON.getFiles(currentPath)">
      <div class="col-xs-12 visible-xs-block visible-sm-block clearfix" v-if="index % 2 == 0"></div>
      <div class="col-md-12 visible-md-block visible-lg-block clearfix" v-if="index % 3 == 0"></div>
      <file-item :key="item.model.uuid" :fileId="item.model.uuid"></file-item>
    </template>
  </div>
</div>
</template>

<style>
p.bg-warning {
  padding: 10px;
}

.filter-nav {
  margin-bottom: 10px;
}
</style>

<script>
import FileItem from './file_item.vue';
import FolderItem from './folder_item.vue';

module.exports = {
  data () {
    return {
      route: [],
      currentPath: null
    };
  },
  computed: {
    state () {
      return this.$store.state;
    },
    folderJSON () {
      return window.folderJSON;
    }
  },
  created () {
    this.updateDisplayData();
  },
  methods: {
    updateDisplayData () {
      this.route = [];
      this.currentPath = null;

      const folderPath = this.$route.params.path;
      let root = this.folderJSON.root;
      let path = '';

      // TODO: Move to folder_model
      if (folderPath) {
        for (let key of folderPath.split('/')) {
          const child = this.folderJSON.getChild(root, key);
          if (child) {
            root = child;
            path += '/' + key;
            this.route.push({
              name: key,
              path
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
    'file-item': FileItem,
    'folder-item': FolderItem
  }
};
</script>
