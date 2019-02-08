// @flow

import * as babelTypes from '@babel/types';
import type { BabelTypesTypeAnnotationType } from '../flow-types/Type.flow';

type BuilderFunctionType = mixed => BabelTypesTypeAnnotationType;
type BuilderFunctionsType = $ReadOnly<{
  [string]: BuilderFunctionType,
}>;

const builderFunctionsMap: BuilderFunctionsType = {
  StringLiteral: babelTypes.StringLiteralTypeAnnotation,
  NumericLiteral: babelTypes.NumberLiteralTypeAnnotation,
  BooleanLiteral: babelTypes.BooleanLiteralTypeAnnotation,
  NullLiteral: babelTypes.NullLiteralTypeAnnotation,
  Tuple: babelTypes.TupleTypeAnnotation,
  Object: babelTypes.ObjectTypeAnnotation,
  Void: babelTypes.VoidTypeAnnotation,
  String: babelTypes.StringTypeAnnotation,
  TemplateLiteral: babelTypes.StringTypeAnnotation,
  Number: babelTypes.NumberTypeAnnotation,
  Boolean: babelTypes.BooleanTypeAnnotation,
  Any: babelTypes.AnyTypeAnnotation,
};

export const knownTypes: $ReadOnlyArray<string> = Object.keys(builderFunctionsMap);

export default (type: string): BuilderFunctionType => {
  const builderFunction = builderFunctionsMap[type];
  if (builderFunction == null) {
    return builderFunctionsMap.Any;
  }

  return builderFunction;
};
