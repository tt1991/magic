'use strict';

const Models = require('./models');

module.exports = {
  cleanUpDb: async function() {
    await Models.tests.destroy({ truncate: true, force: true });
  }
};
