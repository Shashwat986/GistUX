<template>
  <div class="list-group move-list-group">
    <a class="list-group-item active">
      {{folderPath}}
      <span class="badge" @click="moveItem">Move Here</span>
    </a>
    <a v-for="folder in folders" @click="updatePath(folder)" class="list-group-item">
      {{folder}}
    </a>
    <div class="list-group-item">
      <a @click="removePath">Back</a>
      <a class="pull-right" @click="createFolder">New Folder</a>
    </div>
  </div>
</template>

<script>
export default {
  props: ['fileNode'],
  data () {
    return {
      currentPath: []
    };
  },
  computed: {
    currentFolder () {
      return window.folderJSON.getNodeFromPath(this.currentPath);
    },
    folders () {
      return window.folderJSON.getFolders(this.currentFolder).map((e) => e.model.name);
    },
    folderPath () {
      if (this.currentPath.length > 0) {
        return `GistUX / ${this.currentPath.join(' / ')}`;
      }

      return 'GistUX';
    }
  },
  methods: {
    updatePath (val) {
      this.currentPath.push(val);
    },
    removePath () {
      this.currentPath.pop();
    },
    createFolder () {
      this.$store.commit('addFolderToFolderJSON', {
        folderName: null,
        node: this.currentFolder
      });
      this.$store.dispatch('updateGistUXConfig');
    },
    moveItem () {
      window.folderJSON.move(this.fileNode, this.currentFolder);
      this.$store.dispatch('updateGistUXConfig');
    }
  }
};
</script>

<style>
.move-list-group {
  margin-bottom: 0;
}
</style>
