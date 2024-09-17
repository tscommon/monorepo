#!/usr/bin/env node

/* eslint-disable */

const fs = require('fs');

const [, , source, destination, filter] = process.argv;

let regex = filter ? new RegExp(filter) : null;

fs.cpSync(source, destination, {
  filter: (source) => !regex?.test(source),
  recursive: true,
});
