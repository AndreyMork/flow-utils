import fs from 'fs';
import path from 'path';
import format from 'prettier-eslint';

const app = require('../src').default;

const pathToFixtures = path.join(__dirname, '../__fixtures__/');

test.skip('test', () => {
  const sourceFileContent = fs.readFileSync(path.join(pathToFixtures, 'source.js'), 'utf-8');
  const distFileContent = fs.readFileSync(path.join(pathToFixtures, 'dist.js'), 'utf-8');

  const res = format({ text: app(sourceFileContent) });
  const expected = format({ text: distFileContent });
  expect(res).toBe(expected);
});
