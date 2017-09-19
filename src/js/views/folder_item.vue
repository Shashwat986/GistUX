<template>
  <div
    class="col-xs-6 col-md-4 panel-container folder-panel"
    draggable="true"
    @dragstart="dragStart"
    @dragend="dragEnd"
    @dragover.prevent
    @drop="drop">
    <div class="panel panel-default">
      <div class="panel-heading">
        <template v-if="typeof folder === 'object'">
          <h3 :class="['panel-title', 'form-group', {'has-error': editBoxHasError}]" v-if="showEditBox">
            <input :value="folder.model.name" @keyup.enter="updateName" @focusout="updateName" class="form-control" v-focus />
          </h3>
          <router-link :to="getFolderUrl(folder.model.name)" class="pointer" v-else>
            <h3 class="panel-title">
              {{folder.model.name}}
            </h3>
          </router-link>
          <span class="pull-right pointer" @click="openEditBox" v-show="!showEditBox">Edit</span>
        </template>
        <template v-else>
          <a @click="addFolder" class="pointer">
            <h3 class="panel-title">Create New Folder</h3>
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
      return window.folderJSON;
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
      return `${(this.$route.path || '/list')}/${key}`;
    },
    addFolder () {
      this.$store.commit('addFolderToFolderJSON', {
        folderName: null,
        node: this.currentPath
      });
      const retVal = this.$store.state.gistux.mutationReturnValue;
      this.$store.dispatch('updateGistUXConfig');
      this.$store.commit('setRecentlyCreatedFolder', retVal);
      return retVal;
    },
    updateName (e) {
      const newFolderName = e.currentTarget.value;
      if (newFolderName === this.folder.model.name) {
        this.closeEditBox();
        return;
      }

      if (this.folderJSON.updateFolderName(this.folder, newFolderName)) {
        this.$store.dispatch('updateGistUXConfig');
        this.closeEditBox();
      } else {
        this.editBoxHasError = true;
      }
    },
    openEditBox () {
      this.showEditBox = true;
    },
    closeEditBox () {
      this.editBoxHasError = false;
      this.showEditBox = false;
    },
    dragStart (e) {
      // Note: We are not sending any information about the path to the node
      //       This is because we are assuming that drag ends in the same context
      e.dataTransfer.setData('json', JSON.stringify({
        uuid: this.folder.model.name,
      }));
    },
    dragEnd () {
    },
    drop (e) {
      const obj = JSON.parse(e.dataTransfer.getData('json'));
      // Note: This assumes that drag starts in the same context
      //       (Yes, even for files [FIXME?])
      //       (a reasonable assumption)
      const fileNode = this.folderJSON.getNode(obj.uuid, this.currentPath);

      let currentFolder = this.folder;
      if (this.folder === 'new') {
        currentFolder = this.addFolder();
      }

      this.$store.commit('folderJSONmoveFile', {
        fileNode: fileNode,
        folder: currentFolder
      })

      this.$store.dispatch('updateGistUXConfig');
    }
  },
  created () {
    if (this.$store.getters.isRecentlyCreatedFolder(this.folder)) {
      this.openEditBox();
      this.$store.commit('setRecentlyCreatedFolder');
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
