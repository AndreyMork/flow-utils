// @flow

// import type { PathType } from './types.flow';
import Type from './entities/Type';
import ValueType from './entities/ValueType';
import astToFlowType from './astToFlowTypes';
import type { AstNodeType } from './types.flow';

export default (node: AstNodeType): Type => {
  const { type, value } = astToFlowType(node);

  if (ValueType.canAccept(type)) {
    if (value === undefined) {
      throw new Error('Value should be defined');
    }

    return new ValueType(type, value);
  }

  return new Type(type);
};
