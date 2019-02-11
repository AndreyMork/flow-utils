#! /usr/bin/node

// const program = require('commander');
// const fs = require('fs');
// const app = require('..').default;
// const { version } = require('../../package.json');

import 'source-map-support/register';
import program from 'commander';
import fs from 'fs';
import app from '..';
import { version } from '../../package.json';

program
  .description('adds type annotations')
  .version(version)
  .arguments('<input-path> <output-path>')
  // .option('-o, --output [path]', 'output path')
  .action((inputPath, outputPath) => {
    const fileContent = fs.readFileSync(inputPath, 'utf-8');
    const res = app(fileContent);
    fs.writeFileSync(outputPath, res);
  })
  .parse(process.argv);
