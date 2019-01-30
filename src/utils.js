// @flow

import { codeFrameColumns } from '@babel/code-frame';
import type { PathType } from './types.flow';

type argPrintCodeSegOptions = {|
  linesAbove?: number,
  linesBelow?: number,
  message?: string,
|};
type sigPrintCodeSeg = (string, PathType, ?argPrintCodeSegOptions) => void;

export const printCodeSeg: sigPrintCodeSeg = (code, path, options) => {
  const defaultOptions: argPrintCodeSegOptions = {
    linesAbove: 0,
    linesBelow: 0,
  };

  console.log(codeFrameColumns(code, path.node.loc, options || defaultOptions));
};

export const flat = (arr: Array<any>) => {
  const res = arr.reduce((acc, item) => {
    const flattenItem = Array.isArray(item) ? flat(item) : [item];
    return [...acc, ...flattenItem];
  }, []);

  return res;
};
