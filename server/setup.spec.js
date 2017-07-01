'use strict';

const sinon = require('sinon');
const chai = require('chai');
const chaiSubset = require('chai-subset');
const chaiString = require('chai-string');
const sinonChai = require('sinon-chai');
const helpers = require('./spec-helpers');

require('shelljs/global');

before(function() {
  let command = 'node_modules/.bin/sequelize db:migrate ' +
    '--migrations-path=server/migrations --config=server/config/database.json';

  this.timeout(15000);

  // eslint-disable-next-line no-undef
  if (exec(command).code !== 0) {
    process.exit(1);
  }
});

chai.use(sinonChai);
chai.use(chaiSubset);
chai.use(chaiString);
global.expect = chai.expect;

beforeEach(async function() {
  this.sinon = sinon;
  this.helpers = helpers;

  await this.helpers.cleanUpDb();

  this.sandbox = sinon.sandbox.create();
});

afterEach(async function() {
  await this.helpers.cleanUpDb();
  this.helpers = undefined;
  this.sandbox.restore();
  this.sandbox = undefined;
});
