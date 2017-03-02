<template>
<div class="container">
  <div class="content">
    <template v-if="list">
      <h3>Hello {{list}}</h3>
      {{githubKey}}
    </template>
    <spinner v-else></spinner>
  </div>
</div>
</template>

<script>
import Vue from 'vue'
import VueResource from 'vue-resource'
import Spinner from './spinner.vue'

Vue.use(VueResource)

module.exports = {
  data: function () {
    return {
      list: null
    };
  },
  props: ['githubKey'],
  components: {
    spinner: Spinner
  },
  watch: {
    list: function (val) {
    }
  },
  created: function () {
    if (!this.githubKey) {
      this.$parent.$router.push('/');
    }
  },
  mounted: function () {
    this.$http.get('http://httpbin.org/ip').then(function (resp) {
      this.list = resp.body;
    }, function (err) {
      console.log("ERROR");
    });
  }
}
</script>
