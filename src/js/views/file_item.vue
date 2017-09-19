<template>
  <div
    class="col-xs-6 col-md-4 panel-container file-panel"
    :draggable="!loading"
    @dragstart="dragStart"
    @dragend="dragEnd">
    <div
      :class="['panel', fileObject.public ? 'panel-info' : 'panel-warning']"
      v-if="!loading">
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
        <i :class="[fileObject.public ? 'icon-eye' : 'icon-eye-off']"></i>
        <a @click="toggleFiles" v-if="canShowFiles">
          <span v-if="showFiles">Hide Files</span>
          <span v-else>Show Files</span>
        </a>
        <a class="pull-right" @click="toggleMove">
          Move
        </a>
      </div>
      <div class="panel-footer" v-if="showMove">
        <move-modal :fileNode="node"></move-modal>
      </div>
    </div>
    <div v-else-if="errored" class="panel panel-default">
      <div class="panel-heading">
        Invalid Entry
      </div>
      <div class="panel-body">
        Invalid File ID: {{fileId}}
      </div>
    </div>
    <div v-else class="panel panel-default">
      <div class="panel-heading">
        Loading...
      </div>
      <div class="panel-body">
        <spinner :small="true"></spinner>
      </div>
    </div>
  </div>
</template>

<script>
import Spinner from './spinner.vue';
import MoveModal from './move_modal.vue';

module.exports = {
  props: ['node'],
  data () {
    return {
      fileId: this.node.model.uuid,
      loading: false,
      errored: false,
      showFiles: false,
      showMove: false
    };
  },
  computed: {
    canShowFiles () {
      return !(Object.keys(this.fileObject.files).length <= 1);
    },
    fileObject () {
      const val = this.$store.getters.idObjectMapping.get(this.fileId);
      if (val != null) {
        this.loading = false;
      }
      return val;
    },
    fileName () {
      return Object.keys(this.fileObject.files)[0];
    }
  },
  methods: {
    toggleFiles () {
      this.showFiles = !this.showFiles;
    },
    toggleMove () {
      this.showMove = !this.showMove;
    },
    dragStart (e) {
      e.dataTransfer.setData('json', JSON.stringify({
        uuid: this.fileId
      }));
    },
    dragEnd (e) {
    }
  },
  created () {
    if (this.fileObject == null) {
      this.loading = true;
      this.$store.dispatch('getGistDataAndUpdateMap', this.fileId).then(() => {
        this.loading = false;
      }, () => {
        this.errored = true;
        // Note: loading stays true because that's how the conditions are set
      });
    }
  },
  components: {
    'spinner': Spinner,
    'move-modal': MoveModal
  }
};
</script>

<style>
.panel {
  overflow-x: hidden;
}

.file-panel h3.panel-title {
  overflow-x: hidden;
  text-overflow: ellipsis;
  line-height: 1.25em;
  white-space: nowrap;
}
</style>
