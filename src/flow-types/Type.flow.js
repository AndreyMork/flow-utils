// @flow

export type BabelTypesTypeAnnotationType = {};

export type SimpleTypeType = {| type: string |};

export type ValueTypeType = {|
  type: string,
  value: string | number | boolean,
|};

// eslint-disable-next-line no-use-before-define
export type TupleTypeType = {| type: string, elements: $ReadOnlyArray<TypesType> |};

export type ObjectTypeType = {|
  type: string,
  // eslint-disable-next-line no-use-before-define
  properties: $ReadOnlyArray<{| key: string, value: TypesType |}>,
|};

export type TypesType = SimpleTypeType | ValueTypeType | TupleTypeType | ObjectTypeType;
