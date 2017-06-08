'use strict';

const sinon = require('sinon');
const chai = require('chai');
const sinonChai = require('sinon-chai');
const chaiSubset = require('chai-subset');
const chaiString = require('chai-string');
const helpers = require('./spec-helpers');
let Logger = require('logentries-logformat').Logger;

chai.use(chaiSubset);
chai.use(sinonChai);
chai.use(chaiString);
global.expect = chai.expect;

beforeEach(async function() {
  this.sinon = sinon;
  this.helpers = helpers;

  await this.helpers.cleanUpDb();

  this.sandbox = sinon.sandbox.create();
  this.sandbox.stub(Logger.prototype, 'log');
  this.sandbox.stub(Logger.prototype, 'success');
  this.sandbox.stub(Logger.prototype, 'error');
});

afterEach(async function() {
  this.sandbox.restore();
  await this.helpers.cleanUpDb();
});
