'use strict';

const koa = require('koa');
const path = require('path');
const ssl = require('koa-ssl');
const config = require('../../config');
const BoarServer = require('boar-server').app;
const apiResponseHandler = require('../../lib/api-response-handler');

require('shelljs/global');

const createApp = function() {
  const app = new koa();
  const server = new BoarServer(app);
  // app.use(ssl({ trustProxy: true }));
  server.addMiddleware(ssl({ disabled: config.noSslEnforce, trustProxy: config.proxy }));
  server.addBodyParseMiddleware();
  server.loadControllers(path.join(config.root, 'controllers'));
  apiResponseHandler.addHandler(app);
  return app;
};

if (!module.parent) {
  if (config.env !== 'development') {
    let migrationsPath = config.sequelize.migrations_path;
    let configPath = config.sequelize.config_path;

    let command = 'node_modules/.bin/sequelize db:migrate --migrations-path=' + migrationsPath +
      ' --config=' + configPath;

    // eslint-disable-next-line no-undef
    if (exec(command).code !== 0) {
      console.log('Db migration failed');
      process.exit(1);
    }
  }

  createApp().listen(config.port);
  console.log(`Server is listening on port: ${config.port}`);
}

module.exports = createApp;
