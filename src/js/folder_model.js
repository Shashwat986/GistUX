/* eslint-disable class-methods-use-this */

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
      name: 'root',
      type: 'folder'
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

  /* eslint-disable no-param-reassign, no-loop-func */
  addFolder (folderName = null, parentNode = null) {
    if (parentNode === null) {
      parentNode = this.root;
    }
    if (folderName === null) {
      const baseFolderName = 'untitled';
      folderName = baseFolderName;
      let i = 0;
      while (parentNode.children.find((elem) => {
        return elem.model.name === folderName;
      })) {
        folderName = baseFolderName + i;
        i += 1;
      }
    }

    const node = this.treeObject.parse({
      name: folderName,
      type: 'folder'
    });

    parentNode.addChild(node);

    return node;
  }
  /* esline-enable no-param-reassign, no-loop-func */

  // `files` is not mutated. This can be safely called.
  addFiles (files, tNode = null) {
    let node = tNode;
    if (tNode === null) {
      node = this.root;
    }

    files.forEach((file) => {
      const childNode = this.treeObject.parse({
        uuid: file
      });
      node.addChild(childNode);
    });
  }

  getChild (node, key) {
    return node.children.find((elem) => {
      return elem.model.name === key;
    });
  }

  getNode (key, tNode = null) {
    let node = tNode;
    if (node === null) {
      node = this.root;
    }

    return node.children.find((elem) => {
      return (elem.model.name === key || elem.model.uuid === key);
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

  folderNames (node) {
    return this.getFolders(node.parent).map((folder) => {
      if (folder.model === node.model) {
        return null;
      }
      return folder.model.name;
    });
  }

  updateFolderName (node, name) {
    if (!this.isFolder(node)) {
      return false;
    }

    if (this.folderNames(node).includes(name)) {
      return false;
    }

    node.model.name = name;
    return true;
  }

  setData (jsonData) {
    if (this.validate(jsonData)) {
      this.root = this.treeObject.parse(jsonData);
      return true;
    }
    return false;
  }

  move (node, toNode) {
    node.drop();
    toNode.addChild(node);
  }

  asJSON () {
    return JSON.stringify(this.root.model, null, 2);
  }

  writeToFile () {
  }

  readFromFile () {
  }

  validate (jsonData) {
    // TODO
    return true;
  }
}

export default FolderModel;
