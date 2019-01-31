// @flow
/* eslint-disable */

const strtF = (): 'abcd' => 'abcd';
const tempF = (): string => `abc${1}de`;
const numF = (): 123 => 123;
const nanF = (x): any => NaN;
const infF = (x, y): any => Infinity;
const boolF = (): false => false;
const nullF = (): null => null;
const arrF = (): [1, 2, 3, 'a', [1, true, null]] => [1, 2, 3, 'a', [1, true, null]];

const t = (a): 'ttt' => 'ttt';
const f = (): 'fff' => {
  return 'fff';
};

const g = function(): 1 | [1, 2, 3, 'a', [1, true, null]] | 'ggg' {
  if (Math.random() > 0.5) {
    return 1;
  } else if (true) {
    return 'ggg';
  } else if (true) {
    return [1, 2, 3, 'a', [1, true, null]];
  }

  return 'ggg';
};

function y(): 'yyy' {
  return 'yyy';
}

const anyF = (x): any => {
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
};

function returnLess(): void {}

function emptyReturn(): void {
  return;
}

const objF = (a): any => ({ a });
