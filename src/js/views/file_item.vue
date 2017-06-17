<template>
  <div
    class="col-xs-6 col-md-4 panel-container"
    draggable="true"
    @dragstart="dragStart"
    @dragover="preventIfFolder"
    @drop="drop">
    <div class="panel panel-default" v-if="elemType === 'folder'">
      <div class="panel-heading">
        <router-link :to="getFolderUrl(folder.model.name)">
          <h3 class="panel-title">{{folder.model.name}}</h3>
        </router-link>
      </div>
    </div>
    <div :class="['panel', fileObject.public ? 'panel-info' : 'panel-warning']" v-else>
      <div class="panel-heading">
        <a :href="fileObject.html_url" target="_blank" :title="fileName">
          <h3 class="panel-title">{{fileName}}</h3>
        </a>
        <h3 class="panel-title col-xs-3 clearfix">
          <span class="pull-right">&nbsp;</span>
        </h3>
      </div>
      <table class="table" v-if="showFiles">
        <tbody>
          <tr v-for="(v,k) in fileObject.files">
            <td>
              <a :href="v.raw_url" target="_blank">{{k}}</a>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="panel-body" v-if="fileObject.description.length > 0">
        {{ fileObject.description }}
      </div>
      <div class="panel-footer clearfix">
        <a @click="toggleFiles" v-if="canShowFiles">
          <span v-if="showFiles">Hide Files</span>
          <span v-else>Show Files</span>
        </a>
        <a class="pull-right" @click="toggleMove">
          Move
        </a>
      </div>
      <div class="panel-footer" v-if="showMove">
        <move-modal :file-object="fileObject"></move-modal>
      </div>
    </div>
  </div>
</template>

<script>
import MoveModal from './move_modal.vue'


module.exports = {
  props: ['fileId', 'elemType', 'folder'],
  data: function () {
    return {
      showFiles: false,
      showMove: false
    };
  },
  computed: {
    canShowFiles: function () {
      if (Object.keys(this.fileObject.files).length <= 1)
        return false

      return true;
    },
    fileObject: function () {
      return this.$store.getters.idObjectMapping.get(this.fileId);
    },
    fileName: function () {
      return Object.keys(this.fileObject.files)[0];
    }
  },
  methods: {
    getFolderUrl: function (key) {
      return (this.$route.params.path || "/list") + "/" + key;
    },
    toggleFiles: function () {
      this.showFiles = !this.showFiles;
    },
    toggleMove: function () {
      this.showMove = !this.showMove;
    },
    dragStart: function (e) {
      e.dataTransfer.setData("json", JSON.stringify(this._props));
    },
    preventIfFolder: function (e) {
      if (this.elemType === 'folder')
        e.preventDefault();
    },
    drop: function (e) {
      let obj = JSON.parse(e.dataTransfer.getData("json"));
    }
  },
  components: {
    "move-modal": MoveModal
  }
}
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
