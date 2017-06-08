'use strict';

const fs = require('fs');
const path = require('path');

const environmentVariables = {
  DEBUG: '',
  PORT: 3333,
  BASE_URL: 'http://localhost:3333',
  NODE_ENV: 'development',
  NO_SSL_ENFORCE: 'true'
};

module.exports = {
  server: {
    filePattern: ['!server/**/*.factory.*', '!server/**/*.spec.*', 'server/**/*.{jade,js,css,json}', '.npmrc', 'package.json', 'trace.config.js', 'Procfile'],
    environmentVariables: environmentVariables,
    runnable: 'dist/processes/web/index.js',
    test: {
      environmentVariables: {
        NODE_ENV: 'test',
        NO_SSL_ENFORCE: 'true'
      }
    }
  }
};
