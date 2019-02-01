// @flow

// import type { PathType } from './types.flow';
import Type from './entities/Type';
import ValueType from './entities/ValueType';
import TupleType from './entities/TupleType';
import ObjectType from './entities/ObjectType';
import astToFlowType from './astToFlowTypes';
import type { AstNodeType } from './types.flow';

const buildType = (node: AstNodeType): Type => {
  const typeObj = astToFlowType(node);
  const { type } = typeObj;

  if (ValueType.canAccept(type)) {
    const { value } = typeObj;
    if (value === undefined) {
      throw new Error('Value should be defined');
    }

    return new ValueType(type, value);
  }

  if (TupleType.canAccept(type)) {
    const { elements } = typeObj;
    if (elements === undefined) {
      throw new Error('Elements should be defined');
    }

    return new TupleType(type, elements.map(buildType));
  }

  if (ObjectType.canAccept(type)) {
    const { properties } = typeObj;
    if (properties === undefined) {
      throw new Error('Properties should be defined');
    }
    const mappedProperties = properties.map(prop => ({
      key: prop.key,
      value: buildType(prop.value),
    }));

    return new ObjectType(type, mappedProperties);
  }

  return new Type(type);
};

export default buildType;
