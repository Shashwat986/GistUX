<template>
  <div class="container">
    <div class="row">
      Please do not edit this unless you're sure of what you're doing.
    </div>
    <div class="row">
      <textarea class="config-text-area" v-model="tempJSON"></textarea>
    </div>
    <br/>
    <button class="btn btn-success" :disabled="jsonHasError" @click="saveState">
      Save
    </button>
    <div v-if="jsonHasError">
      Please check the JSON object. There are still errors.
    </div>
  </div>
</template>

<script>
import {objectEqual} from '../util/string';

export default {
  data () {
    return {
      tempJSON: window.folderJSON.asJSON(),
      jsonEdited: false,
      jsonHasError: false
    };
  },
  computed: {
    folderJSON: function () {
      return window.folderJSON;
    },
    folderJSONChanged: function () {
      return this.$store.state.gistux.folderJSONChanged;
    }
  },
  watch: {
    folderJSONChanged: function () {
      if (!this.folderJSONChanged) return;

      if (!this.jsonEdited) {
        // If the JSON has not been user-edited, but the source JSON has changed
        this.tempJSON = this.folderJSON.asJSON();
      }

      this.$store.commit('folderJSONChangeConsumed');
    },
    tempJSON: function () {
      this.jsonEdited = true;
      try {
        JSON.parse(this.tempJSON);
        this.jsonHasError = false;
      } catch (e) {
        this.jsonHasError = true;
      }
    }
  },
  methods: {
    saveState () {
      if (this.jsonHasError) return;

      const textJSON = JSON.parse(this.tempJSON);

      if (!objectEqual(textJSON, this.folderJSON.root.model)) {
        this.jsonHasError = this.$store.commit('setFolderJSON', textJSON);
        if (!this.jsonHasError) {
          this.jsonEdited = false;
          this.$store.dispatch('updateGistUXConfig').then(() => {
            this.$store.dispatch('setSuccess', 'GistUX config saved');
          });
        } else {
          this.$store.dispatch('setError', 'There was a problem saving the configuration file. Please check the JSON.');
        }
      }
    }
  }
};
</script>

<style>
textarea.config-text-area {
  width: 100%;
  height: 200px;
  font-family: monospace;
}
</style>
