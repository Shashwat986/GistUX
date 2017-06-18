const TreeModel = require('tree-model');

class FolderModel {
  constructor () {
    this.objectID = null;

    /*
      I'm using TreeModel to model the directory structure.
      Each node represents an object which may be a folder or a file
    */
    this.treeObject = new TreeModel();
    this.root = this.treeObject.parse({
      name: "root",
      type: "folder"
    });
  }

  isEmpty () {
    return (this.root.children.length === 0);
  }

  isFile (node) {
    return (node.model.type !== 'folder');
  }

  isFolder (node) {
    return (node.model.type === 'folder');
  }

  // `files` is not mutated. This can be safely called.
  addFiles (files, node = null) {
    if (node === null) {
      node = this.root;
    }

    for (let file of files) {
      const child_node = this.treeObject.parse({
        uuid: file
      });
      node.addChild(child_node);
    }
  }

  getChild (node, key) {
    return node.children.find(function (elem) {
      return elem.model.name == key;
    });
  }

  getFiles (node) {
    return node.children.filter((elem) => {
      return this.isFile(elem);
    });
  }

  getFolders (node) {
    return node.children.filter((elem) => {
      return this.isFolder(elem);
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
