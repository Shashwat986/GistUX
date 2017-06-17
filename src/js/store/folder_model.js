const TreeModel = require('tree-model');

class FolderModel {
  constructor () {
    this.objectID = null;

    /*
      I'm using TreeModel to model the directory structure.
      Each node represents a folder, which contains an array `files`.
    */
    this.treeObject = new TreeModel();
    this.root = this.treeObject.parse({
      name: "root",
      files: []
    });
  }

  isEmpty () {
    return (this.root.model.files.length == 0) && (this.root.children.length == 0);
  }

  // `files` is not mutated. This can be safely called.
  addFiles (files) {
    files = new Set([...this.root.model.files, ...files]);
    this.root.model.files = Array.from(files);
  }

  addFile (node, file) {
  }

  getChild (node, key) {
    return node.children.find(function (elem) {
      return elem.model.name == key;
    });
  }

  setData (jsonData) {
    if (this.validate(jsonData)) {
      this.root = this.treeObject.parse(jsonData);
      return true;
    }
    return false;
  }

  move (file, fromNode, toNode) {
  }

  asJSON() {
    return JSON.stringify(this.root.model, null, 2);
  }

  writeToFile() {
  }

  readFromFile() {
  }

  validate (jsonData) {
    // TODO
    return true;
  }
}

window.f = FolderModel;

export default FolderModel;
