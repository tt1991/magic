'use strict';

const config = require('./config');
const { PgDatabase } = require('@emartech/me-psql-query-builder');
const pgDb = PgDatabase.create(config.databaseUrl);

module.exports = {
  cleanUpDb: async function() {
    const tableNames = await pgDb.any(
      "SELECT table_name FROM information_schema.tables WHERE table_schema='public' AND table_type='BASE TABLE';"
    );

    for (let i = 0; i < tableNames.length; i++) {
      await pgDb.dropTable(tableNames[i].table_name);
    }
  }
};
