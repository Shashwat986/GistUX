<template>
    <div class="col-md-4 col-xs-6">
      <div :class="['panel', fileObject.public ? 'panel-info' : 'panel-warning']">
        <div class="panel-heading">
          <a :href="fileObject.html_url" target="_blank">
            <h3 class="panel-title">{{fileName}}</h3>
          </a>
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
        <div class="panel-footer">
          <a @click="toggleFiles">
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
  data: function () {
    return {
      showFiles: false
    };
  },
  computed: {
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
    }
  }
}
</script>

<style>
.panel {
  overflow-x: hidden;
}
</style>
