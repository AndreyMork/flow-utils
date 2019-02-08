// @flow

import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import Tree from './Tree';

const pathToTypesHierarchy = path.join(__dirname, './types-hierarchy.yaml');

const typesHierarchyObject = yaml.safeLoad(fs.readFileSync(pathToTypesHierarchy, 'utf-8'));
// NOTE: consider validation

const typesHierarchy = new Tree((typesHierarchyObject: any));

export default typesHierarchy;
