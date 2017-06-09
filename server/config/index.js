'use strict';

const path = require('path');

const getDbConfig = function(nodeEnv) {
  if (nodeEnv === 'test') {
    return process.env.DATABASE_TEST_URL;
  }

  if (nodeEnv === 'production') {
    return process.env.DATABASE_URL + '?ssl=true';
  }

  return process.env.DATABASE_URL;
};

const getPath = function(env) {
  if (env === 'development') {
    return {
      migrations_path: 'dist/migrations',
      config_path: 'dist/config/database.json'
    };
  }
  return {
    migrations_path: 'server/migrations',
    config_path: 'server/config/database.json'
  };
};

const config = {
  root: path.normalize(__dirname + '/../processes/web'),
  env: process.env.NODE_ENV,

  ip: process.env.IP || undefined,
  port: process.env.PORT || 3000,

  proxy: process.env.PROXY === 'true',
  noSslEnforce: process.env.NO_SSL_ENFORCE === 'true',

  databaseUrl: getDbConfig(process.env.NODE_ENV),

  sequelize: getPath(process.env.NODE_ENV),

  amqp: {
    default: {
      url: process.env.AMQP_DEFAULT_KEY ?
        process.env[process.env.AMQP_DEFAULT_KEY] :
        process.env.AMQP_URL || process.env.CLOUDAMQP_URL
    }
  },

  ttl: {
    idempontency: process.env.TTL_IDEMPONTENCY || 60 * 60 * 6
  }

};

module.exports = config;
