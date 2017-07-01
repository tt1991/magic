'use strict';

const koa = require('koa');
const path = require('path');
const app = new koa();
const config = require('../../config');
const BoarServer = require('boar-server').app;
const server = new BoarServer(app);
const ssl = require('koa-ssl');
const apiResponseHandler = require('../../lib/api-response-handler');

require('shelljs/global');

app.use(ssl({ trustProxy: true }));

apiResponseHandler.addHandler(app);

server.addBodyParseMiddleware();
server.addCorsSupportMiddleware();
server.loadControllers(path.join(config.root, 'controllers'));
server.addStaticContentMiddleware(path.join(config.root, '../..', 'static'));


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

  app.listen(config.port);
  console.log(`Server is listening on port: ${config.port}`);
}

module.exports = app;
