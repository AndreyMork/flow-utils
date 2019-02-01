// @flow

export type TreeObjectType = {|
  data: string,
  children: Array<TreeObjectType>,
|};

export type PathType = any;
export type AstNodeType = Object;
export type VisitorType = any;
