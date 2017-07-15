<template>
  <div
    class="col-xs-6 col-md-4 panel-container folder-panel"
    @dragover.prevent
    @drop="drop">
    <div class="panel panel-default">
      <div class="panel-heading">
        <template v-if="typeof folder === 'object'">
          <h3 :class="['panel-title', 'form-group', {'has-error': editBoxHasError}]" v-if="showEditBox">
            <input :value="folder.model.name" @keyup.enter="updateName" @focusout="updateName" class="form-control" v-focus />
          </h3>
          <router-link :to="getFolderUrl(folder.model.name)" v-else>
            <h3 class="panel-title">
              {{folder.model.name}}
            </h3>
          </router-link>
          <span class="pull-right pointer" @click="openEditBox" v-show="!showEditBox">Edit</span>
        </template>
        <template v-else>
          <a @click="addFolder" class="pointer">
            <h3 class="panel-title">New Folder</h3>
          </a>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
module.exports = {
  props: ['folder', 'current-path'],
  data () {
    return {
      showEditBox: false,
      editBoxHasError: false,
    };
  },
  computed: {
    folderJSON () {
      return this.$store.state.gistux.folderJSON;
    }
  },
  directives: {
    focus: {
      inserted (el) {
        el.focus();
      },
      update (el) {
        el.focus();
      }
    }
  },
  methods: {
    getFolderUrl (key) {
      return `${(this.$route.params.path || '/list')}/${key}`;
    },
    addFolder () {
      return this.folderJSON.addFolder(null, this.currentPath);
      this.$store.dispatch('updateGistUXConfig');
    },
    updateName (e) {
      const newFolderName = e.currentTarget.value;
      if (newFolderName === this.folder.model.name) {
        this.closeEditBox();
        return;
      }

      // TODO: Move this to FolderModel
      const folderNames = this.folderJSON.
        getFolders(this.folder.parent).
        map((folder) => {
          // To ensure that the same filename isn't rejected
          if (folder.model === this.folder.model)
            return null;
          return folder.model.name;
        });

      if (folderNames.includes(newFolderName)) {
        this.editBoxHasError = true;
      } else {
        this.folder.model.name = newFolderName;
        this.$store.dispatch('updateGistUXConfig');
        this.closeEditBox();
      }
    },
    openEditBox () {
      this.showEditBox = true;
    },
    closeEditBox () {
      this.editBoxHasError = false;
      this.showEditBox = false;
    },
    drop (e) {
      const obj = JSON.parse(e.dataTransfer.getData('json'));
      const fileNode = this.folderJSON.getNode(obj.fileId, this.currentPath);
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

.folder-panel h3.panel-title {
  overflow-x: hidden;
  text-overflow: ellipsis;
  line-height: 1.25em;
  white-space: nowrap;
  max-width: 75%;
  display: inline-block;
}
</style>
