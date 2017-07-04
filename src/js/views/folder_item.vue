<template>
  <div
    class="col-xs-6 col-md-4 panel-container"
    @dragover.prevent
    @drop="drop">
    <div class="panel panel-default">
      <div class="panel-heading">
        <template v-if="typeof folder === 'object'">
          <router-link :to="getFolderUrl(folder.model.name)">
            <h3 class="panel-title">{{folder.model.name}}</h3>
          </router-link>
        </template>
        <template v-else>
          <h3 class="panel-title">New</h3>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
module.exports = {
  props: ['folder', 'current-path'],
  computed: {
    folderJSON () {
      return this.$store.state.gistux.folderJSON;
    }
  },
  methods: {
    getFolderUrl (key) {
      return `${(this.$route.params.path || '/list')}/${key}`;
    },
    drop (e) {
      const obj = JSON.parse(e.dataTransfer.getData('json'));
      const fileNode = this.folderJSON.getNode(obj.fileId);
      let currentFolder = this.folder;
      if (this.folder === 'new') {
        currentFolder = this.folderJSON.addFolder(null, this.currentPath);
      }

      this.folderJSON.move(fileNode, currentFolder);
      this.$store.dispatch('updateGistUXConfig');
    }
  }
};
</script>

<style>
.panel {
  overflow-x: hidden;
}

h3.panel-title {
  overflow-x: hidden;
  text-overflow: ellipsis;
  line-height: 1.25em;
  white-space: nowrap;
}
</style>
