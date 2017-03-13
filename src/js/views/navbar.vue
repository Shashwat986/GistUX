<template>
<nav class="navbar navbar-inverse navbar-fixed-top" role="navigation">
  <div class="container">
    <div class="navbar-header">
      <a class="navbar-brand" href="#">GistUX</a>
    </div>
    <div class="navbar-right" v-if="state.github.githubKey">
      <ul class="navbar-nav nav">
        <li><a>Github Token: {{state.github.githubKey}}</a></li>
        <li>
          <button type="submit" class="btn navbar-btn btn-danger" v-on:click="endSession">End Session</button>
        </li>
      </ul>
    </div>
    <template v-else>
      <div class="navbar-right">
        <div class="navbar-form">
          <div class="input-group">
            <span class="input-group-addon pointer" v-on:click="setGithubKey(githubKey)">Enter Token</span>
            <input type="text" v-model="githubKey" v-on:keyup.enter="setGithubKey(githubKey)" class="form-control">
          </div>
        </div>
      </div>
      <div class="navbar-right">
        <ul class="navbar-nav nav">
          <li><a target="_blank" href="https://github.com/settings/tokens">Get Github Authentication Token</a></li>
        </ul>
      </div>
    </template>
  </div>
</nav>
</template>

<script>
module.exports = {
  data: function () {
    return { githubKey: null };
  },
  props: ['setGithubKey'],
  computed: {
    state: function () {
      return this.$store.state;
    }
  },
  methods: {
    endSession: function () {
      this.$store.commit('destroySession');
      this.$router.push('/');
      this.$store.dispatch('setSuccess', 'Logged out Successfully!');
    }
  }
}
</script>
