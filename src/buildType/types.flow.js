// @flow

export type BabelTypesTypeAnnotationType = {};

export type TypesType =
  // SimpleType
  | {| type: string |}
  // ValueType
  | {|
      type: string,
      value: string | number | boolean,
    |}
  // TupleType
  | {| type: string, elements: $ReadOnlyArray<TypesType> |}
  // ObjectType
  | {|
      type: string,
      properties: $ReadOnlyArray<{| key: string, value: TypesType |}>,
    |};

// export type SimpleTypeType = {| type: string |};
// export type ValueTypeType = {|
//   type: string,
//   value: string | number | boolean,
// |};
// export type TupleTypeType = {| type: string, elements: Array<TypesType> |};
//
// export type ObjectType = {|
//   type: string,
//   properties: Array<{| key: string, value: TypesType |}>,
// |};
//
// export type TypesType =
//   SimpleTypeType
//   | ValueTypeType
//   | TupleTypeType
//   | ObjectType;
