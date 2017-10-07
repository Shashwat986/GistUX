/* eslint-disable class-methods-use-this */

import { objectEqual } from './util/string';

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

  allFiles () {
    return this.root.all((node) => {
      return this.isFile(node);
    }).map((node) => node.model.uuid);
  }

  getNodeFromPath (folderPath) {
    let node = this.root;
    let path = folderPath;

    if (path == null) {
      return node;
    }

    if (typeof path === 'string') {
      path = path.split('/');
    }

    for (const key of path) {
      const child = this.getChild(node, key);
      if (child) {
        node = child;
      } else {
        return null;
      }
    }

    return node;
  }

  getPathFolders (node) {
    return node.getPath().map((e) => e.model.name);
  }

  getPathBreadcrumb (node) {
    let path = '';
    const folders = this.getPathFolders(node);
    folders.shift(); // Removing root element
    return folders.map((elem) => {
      path += `/${elem}`;
      return {
        name: elem,
        path
      };
    });
  }

  objectEqual (node1, node2) {
    const path1 = this.getPathFolders(node1);
    const path2 = this.getPathFolders(node2);
    return (objectEqual(path1, path2) && objectEqual(node1.model, node2.model));
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

    // Validate Folder Name
    if (name.indexOf('/') !== -1) {
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
    if (this.objectEqual(node, toNode)) {
      return null;
    }
    node.drop();
    toNode.addChild(node);
    return true;
  }

  dropNode (node) {
    if (this.objectEqual(node, this.root)) {
      return null;
    }

    const par = node.parent;
    node.drop().children.forEach((elem) => {
      par.addChild(elem);
    });

    return par;
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

  validateFile (fileContent) {
    try {
      return this.validate(JSON.parse(fileContent));
    } catch (e) {
      return false;
    }
  }
}

export default FolderModel;
