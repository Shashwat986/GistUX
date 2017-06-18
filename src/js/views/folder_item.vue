<template>
  <div
    class="col-xs-6 col-md-4 panel-container"
    @dragover="preventDefault"
    @drop="drop">
    <div class="panel panel-default">
      <div class="panel-heading">
        <router-link :to="getFolderUrl(folder.model.name)">
          <h3 class="panel-title">{{folder.model.name}}</h3>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
module.exports = {
  props: ['folder'],
  data () {
    return {
      showFiles: false,
      showMove: false
    };
  },
  methods: {
    getFolderUrl (key) {
      return `${(this.$route.params.path || '/list')}/${key}`;
    },
    preventDefault (e) {
      e.preventDefault();
    },
    drop (e) {
      let obj = JSON.parse(e.dataTransfer.getData('json'));
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
