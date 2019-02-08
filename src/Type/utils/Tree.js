// @flow

type TreeObjectType = {|
  data: string,
  children: Array<TreeObjectType>,
|};

class Tree {
  data: string;

  children: Array<Tree>;

  constructor(objTree: TreeObjectType) {
    this.data = objTree.data;
    this.children = objTree.children.map(child => new Tree(child));
  }

  static dfs(root: Tree, value: string): ?Tree {
    if (root.data === value) {
      return root;
    }

    const res = root.children.reduce((acc: ?Tree, child: Tree): ?Tree => {
      if (acc !== undefined) {
        return acc;
      }

      return child.findNode(value);
    }, undefined);

    return res;
  }

  getChildren(): Array<Tree> {
    return this.children;
  }

  findNode(value: string): ?Tree {
    return Tree.dfs(this, value);
  }

  includes(value: string): boolean {
    return this.findNode(value) !== undefined;
  }

  getNodeLevel(value: string): ?number {
    const traverse = (currNode: Tree, currLevel: number): ?number => {
      if (currNode.data === value) {
        return currLevel;
      }

      return currNode.getChildren().reduce((acc: ?number, child: Tree): ?number => {
        if (acc !== undefined) {
          return acc;
        }

        return traverse(child, currLevel + 1);
      }, undefined);
    };

    return traverse(this, 1);
  }
}

export default Tree;
