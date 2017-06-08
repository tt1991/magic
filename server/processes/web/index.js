'use strict';

const koa = require('koa');
const path = require('path');
const config = require('../../config');
const BoarServer = require('boar-server').app;
const ssl = require('koa-ssl');
const apiResponseHandler = require('../../lib/api-response-handler');

// const database = require('../../lib/database');

const createApp = function() {
  const app = new koa();
  const server = new BoarServer(app);
  apiResponseHandler.addHandler(app);
  server.addMiddleware(ssl({ disabled: config.noSslEnforce, trustProxy: config.proxy }));
  server.addBodyParseMiddleware();
  server.loadControllers(path.join(config.root, 'controllers'));
  return app;
};

if (!module.parent) {
  // database.connect();

  createApp().listen(config.port);
  console.log(`Server is listening on port: ${config.port}`);
}

module.exports = createApp;
