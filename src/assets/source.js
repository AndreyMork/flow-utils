// @flow
/* eslint-disable */

const strtF = () => 'abcd';
const tempF = () => `abc${1}de`;
const numF = () => 123;
const boolF = () => false;
const nullF = () => null;

const t = () => 'ttt';
const f = () => {
  return 'fff';
};
const g = function() {
  if (Math.random() > 0.5) {
    return 1;
  } else if (true) {
    return x;
  }

  return 'ggg';
};
function y() {
  return 'yyy';
}
