<template>
<div>
  <div class="container-fluid bg-danger" v-if="state.banner.error">
    <p class="text-center m10-top">{{state.banner.error}}</p>
  </div>
  <div class="container-fluid bg-success" v-if="state.banner.success">
    <p class="text-center m10-top">{{state.banner.success}}</p>
  </div>
</div>
</template>

<script>
export default {
  computed: {
    state () {
      return this.$store.state;
    }
  }
};
</script>
