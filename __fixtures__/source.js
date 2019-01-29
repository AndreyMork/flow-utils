// @flow
/* eslint-disable */

const strtF = () => 'abcd';
const tempF = () => `abc${1}de`;
const numF = () => 123;
const nanF = (x) => NaN;
const infF = (x, y) => Infinity;
const boolF = () => false;
const nullF = () => null;
const arrF = () => [1, 2, 3, 'a', [1, true, null]];

const t = (a) => 'ttt';
const f = () => {
  return 'fff';
};

const g = function() {
  if (Math.random() > 0.5) {
    return 1;
  } else if (true) {
    return 'ggg';
  } else if (true) {
    return [1, 2, 3, 'a', [1, true, null]];
  }

  return 'ggg';
};

function y() {
  return 'yyy';
}

const anyF = (x) => {
  if (true) {
    return x;
  } else if (false) {
    return;
  } else if (true) {
    return;
  } else if (true) {
    return null;
  }

  return 'aaa';
}

function returnLess() {};

function emptyReturn() {
  return;
}

const objF = (a) => ({ a });
