// @flow

import type { PathType } from './types';

const { codeFrameColumns } = require('@babel/code-frame');


type argPrintCodeSegOptions = {|
  linesAbove?: number,
  linesBelow?: number,
  message?: string,
|};
type sigPrintCodeSeg = (string, PathType, ?argPrintCodeSegOptions) => void;

const printCodeSeg: sigPrintCodeSeg = (code, path, options) => {
  const defaultOptions: argPrintCodeSegOptions = {
    linesAbove: 0,
    linesBelow: 0,
  };

  console.log(codeFrameColumns(code, path.node.loc, options || defaultOptions));
};


module.exports = {
  printCodeSeg,
};
