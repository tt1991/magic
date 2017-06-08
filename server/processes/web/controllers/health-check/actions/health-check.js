'use strict';

const config = require('../../../../../config');
const { PgDatabase } = require('@emartech/me-psql-query-builder');
const logger = require('logentries-logformat')('me-data-healthcheck');

module.exports = async function() {
  const pgsqlResult = await PgDatabase.create(config.databaseUrl).one('SELECT 1 as value');
  const isPgsqlUp = pgsqlResult.value === 1;

  const success = isPgsqlUp;

  if (!isPgsqlUp) {
    logger.error('connection error', 'PGSQL is not available!');
  }

  this.sendApiResponse(success ? 200 : 500, '', { success });

};
