// @flow

import type { TreeObjectType } from './types.flow';

class Tree {
  data: string;

  children: Array<Tree>;

  constructor(objTree: TreeObjectType): void {
    this.data = objTree.data;
    this.children = objTree.children.map(child => new Tree(child));
  }

  static dfs(root: Tree, value: string): ?Tree {
    if (root.data === value) {
      return root;
    }

    // const res = root.children.reduce((acc: ?Tree, child: Tree): ?Tree => {
    //   if (acc !== undefined) {
    //     return acc;
    //   }
    //
    //   return child.findNode(value);
    // }, undefined);

    const nodeIsFound = (node: Tree): boolean => Tree.dfs(node, value) !== undefined;
    const res = root.children.find(nodeIsFound);

    return res;
  }

  getChildren(): Array<Tree> {
    return this.children;
  }

  findNode(value: string): ?Tree {
    return Tree.dfs(this, value);
  }

  // traverse(cb: Tree => any) {
  //   cb(this);
  //   this.children.forEach(cb);
  // }
}

export default Tree;
