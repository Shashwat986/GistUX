<template>
  <div
    class="col-xs-6 col-md-4 panel-container file-panel"
    draggable="true"
    @dragstart="dragStart"
    @dragend="dragEnd">
    <div :class="['panel', fileObject.public ? 'panel-info' : 'panel-warning']">
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
        Hello World
        <a @click="toggleFiles" v-if="canShowFiles">
          <span v-if="showFiles">Hide Files</span>
          <span v-else>Show Files</span>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
module.exports = {
  props: ['fileId'],
  data () {
    return {
      showFiles: false,
      showMove: false
    };
  },
  computed: {
    canShowFiles () {
      if (Object.keys(this.fileObject.files).length <= 1) {
        return false;
      }

      return true;
    },
    fileObject () {
      return this.$store.getters.idObjectMapping.get(this.fileId);
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
        fileId: this.fileId
      }));
    },
    dragEnd (e) {
    }
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
