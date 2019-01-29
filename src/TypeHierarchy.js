// @flow

import typesHierarchy from './types-hierarchy.json';
// const typesHierarchy: TreeObjectType = require('./types-hierarchy.json');

type TreeArgType = { [value: string]: TreeArgType | null };

class Tree {
  data: string;

  children: Array<Tree>;

  constructor(objTree: TreeArgType): void {
    if (Object.keys(objTree).length !== 1) {
      throw new Error('Tree must have exactly one root');
    }

    const [key] = Object.keys(objTree);
    // const values = Object.values(objTree[key]);
    this.data = key;
    const subObject = objTree[key];
    if (subObject === null) {
      this.children = [];
    } else {
      const values = Object.keys(subObject).map((subKey: string) => ({
        subKey: subObject[subKey],
      }));
      this.children = values.map(child => new Tree(child));
    }

    // if (values === null) {
    //   this.children = [];
    // } else {
    //   this.children = values.map(child => new Tree(child));
    // }
    // this.children = values === null ? [] : values.map(child => new Tree(child));
  }

  // static DFS(root: Tree, value: string) {
  //   const children = root.getChildren;
  // }
  //
  // getChildren(): Array<Tree> {
  //   return this.children;
  // }
  // // findNode(value: string) {
  // //
  // // }
}

//
// class HT {
//   tree: Object;
//
//   static tree = typesHierarchy;
//
//   static isSubtype(a: string, b: string): boolean {}
// }
