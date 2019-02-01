// @flow

export type TreeObjectType = {|
  data: string,
  children: Array<TreeObjectType>,
|};

export type PathType = Object;
export type AstNodeType = Object;
export type VisitorType = Object;
