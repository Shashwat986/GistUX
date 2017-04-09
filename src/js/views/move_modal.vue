<template>
  <div class="list-group move-list-group">
    <a class="list-group-item active">
      {{folderPath}}
      <span class="badge" @click="moveItem">Move Here</span>
    </a>
    <a v-for="(value, key) in currentFolder.folders" @click="updatePath(key)" class="list-group-item">
      {{key}}
    </a>
    <div class="list-group-item">
      <a @click="removePath">Back</a>
      <a class="pull-right" @click="toggleNewFolder">New Folder</a>
    </div>
    <div class="list-group-item" v-show="showNewFolderInput">
      <div class="input-group">
        <input type="text" v-model="newFolderName" @keyup.enter="createFolder" class="form-control" />
        <span class="input-group-btn">
          <a :class="['btn', 'btn-default', {'disabled': !validFolderName}]">Create</a>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
module.exports = {
  props: ['fileObject'],
  data: function () {
    return {
      showNewFolderInput: false,
      currentPath: [],
      newFolderName: null
    };
  },
  computed: {
    currentFolder: function () {
      let val = this.$store.state.gistux.folderJSON["root"];
      for (let key of this.currentPath) {
        if (val.folders && val.folders[key])
          val = val.folders[key];
        else
          break;
      }
      return val;
    },
    folderPath: function () {
      if (this.currentPath.length > 0)
        return "GistUX / " + this.currentPath.join(" / ");
      else
        return "GistUX"
    },
    validFolderName: function () {
      // TODO
      return true;
    }
  },
  methods: {
    toggleNewFolder: function () {
      this.showNewFolderInput = !this.showNewFolderInput;
    },
    updatePath: function (val) {
      this.currentPath.push(val);
    },
    removePath: function () {
      this.currentPath.pop();
    },
    createFolder: function () {
      if (!this.validFolderName) return;

      // TODO
      let root = this.$store.state.gistux.folderJSON;
      let val = root["root"];
      for (let key of this.currentPath) {
        if (val.folders && val.folders[key])
          val = val.folders[key];
        else
          return;
      }

      if (!val.folders) val.folders = {};
      val.folders[this.newFolderName] = {
        folders: {},
        files: []
      };

      this.$store.dispatch('updateFolderJSON', root);
    },
    moveItem: function () {
      // TODO
    }
  }
}
</script>

<style>
.move-list-group {
  margin-bottom: 0;
}
</style>
