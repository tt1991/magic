'use strict';

const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../../../../../config/database.json')[env];

module.exports = async function() {
  const sequelize = config.use_env_variable ?
    new Sequelize(process.env[config.use_env_variable], config) :
    new Sequelize(config.database, config.username, config.password, config);

  const result = await sequelize.query('SELECT true as result', { type: sequelize.QueryTypes.SELECT });

  const success = result[0].result;

  this.sendApiResponse(success ? 200 : 500, '', { success });

};
