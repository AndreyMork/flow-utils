// @flow
/* eslint-disable */

import onlyDefault from './a';
import { named1, named2 } from './b';
import defaultM, { andNamed1, andNamed2 } from '../../c';
import { named2 as alias } from 'alias';
import 'aaa';
import * as ns from 'module';
import defaultM2, * as ns2 from 'module';


const strtF = () => 'abcd';
const tempF = () => `abc${1}de`;
const numF = () => 123;
const nanF = (x) => NaN;
const infF = (x, y) => Infinity;
const boolF = () => false;
const nullF = () => null;

const t = (a) => 'ttt';
const f = () => {
  return 'fff';
};

export const g = function() {
  if (Math.random() > 0.5) {
    return 1;
  } else if (true) {
    return 'ggg';
  }

  return 'ggg';
};

export function y() {
  return 'yyy';
}


function returnLess() {};

function emptyReturn() {
  return;
}
