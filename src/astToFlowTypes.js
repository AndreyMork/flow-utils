// @flow

import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { hasKey } from './utils';
import type { AstNodeType } from './types.flow';

const pathToMap = path.join(__dirname, '../assets/ast-to-flow-types-map.yaml');
const { expressions, ValueType, CommonType } = yaml.safeLoad(fs.readFileSync(pathToMap, 'utf-8'));

export default (
  node: AstNodeType,
): {|
  type: string,
  value?: boolean | number | string,
|} => {
  if (node === undefined) {
    throw new Error('Node is undefined');
  }
  if (node === null) {
    return { type: 'Void' };
  }

  const { type } = node;

  if (hasKey(expressions, type)) {
    const operatorToType = expressions[type];
    const { operator } = node;

    if (operator === null || operator === undefined) {
      throw new Error('operator is required');
    }

    if (!hasKey(operatorToType, operator)) {
      throw new Error(`Unknown operator ${operator}`);
    }

    return { type: operatorToType[operator] };
  }

  if (hasKey(ValueType, type)) {
    const { value } = node;
    return { value, type: ValueType[type] };
  }

  if (hasKey(CommonType, type)) {
    return { type: CommonType[type] };
  }

  console.warn(`Unknown type ${type}`);
  return { type: 'Any' };
};
