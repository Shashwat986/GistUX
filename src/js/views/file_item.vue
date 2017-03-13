<template>
  <div class="col-xs-6 col-md-4 panel-container">
    <div :class="['panel', fileObject.public ? 'panel-info' : 'panel-warning']">
      <div class="panel-heading row">
        <a :href="fileObject.html_url" target="_blank" :title="fileName">
          <h3 class="panel-title col-xs-9">{{fileName}}</h3>
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
        Hello World
      </div>
    </div>
  </div>
</template>

<script>
module.exports = {
  props: ['fileId'],
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
    toggleFiles: function () {
      this.showFiles = !this.showFiles;
    },
    toggleMove: function () {
      this.showMove = !this.showMove;
    }
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
