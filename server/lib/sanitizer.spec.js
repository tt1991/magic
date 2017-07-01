'use strict';

let expect = require('chai').expect;
let Sanitizer = require('./sanitizer');
let Models = require('../models');

describe('Sanitizer', function() {

  describe('basic type checks', function() {

    it('should correctly return verified request data with the right types', async function() {
      const sanitizer = new Sanitizer({ request: { abc: 1, foo: 'bar', xyz: {}, efg: true, int: 1, int_str: '1',
        str: 'str', ary: ['hello'] }, params: {} });

      const req = await sanitizer.check([
        { key: 'int', type: 'integer_string' },
        { key: 'str', type: 'integer_string' },
        { key: 'int_str', type: 'integer_string' },
        { key: 'abc', type: 'integer' },
        { key: 'foo', type: 'string' },
        { key: 'xyz', type: 'object' },
        { key: 'efg', type: 'boolean' },
        { key: 'ary', type: 'array' }
      ]);

      expect(sanitizer.ok).to.eql(true);
      expect(req.abc).to.eql(1);
      expect(req.foo).to.eql('bar');
      expect(req.int).to.eql(1);
      expect(req.int_str).to.eql(1);
      expect(req.str).to.eql('str');
      expect(req.ary).to.eql(['hello']);
    });

    it('should correctly return verified params data', async function() {
      const sanitizer = new Sanitizer({ request: {}, params: { id: 1 } });

      const req = await sanitizer.check([
        { key: ':id', type: 'integer' }
      ]);

      expect(sanitizer.ok).to.eql(true);
      expect(req[':id']).to.eql(1);
    });


    it('should report error if type is wrong', async function() {
      const sanitizer = new Sanitizer({ request: { string: 'value', integer: 1978, ary: 'notAnArray' }, params: {} });

      const req = await sanitizer.check([
        { key: 'object', type: 'integer_string' },
        { key: 'string', type: 'integer' },
        { key: 'integer', type: 'string' },
        { key: 'ary', type: 'array' }
      ]);

      expect(sanitizer.ok).to.eql(false);
      expect(req.integer_string).to.undefined;
      expect(req.string).to.undefined;
      expect(req.integer).to.undefined;
      expect(req.ary).to.undefined;
    });

  });

  describe('database checks', function() {
    let test;

    beforeEach(async function() {
      test = await Models.tests.create({ name: 'sanitizer' });
    });

    afterEach(async function() {
      await Models.tests.destroy({
        where: { name: 'sanitizer' },
        force: true
      });
    });

    it('should correctly return verified model', async function() {
      const sanitizer = new Sanitizer({ request: { app: test.id }, models: Models });

      const req = await sanitizer.check([
        {
          key: 'app',
          type: 'integer',
          model: {
            name: 'tests',
            filters: { name: 'sanitizer' },
            attributes: ['id']
          }
        }
      ]);

      expect(sanitizer.ok).to.eql(true);
      expect(req.app.id).to.eql(test.id);
    });

    it('should correctly return verified model with optionalFilters as well', async function() {
      const sanitizer = new Sanitizer({ request: { app: test.id }, models: Models });

      const req = await sanitizer.check([
        {
          key: 'app',
          type: 'integer',
          model: {
            name: 'tests',
            optionalFilters: { name: 'sanitizer', wrongColumn: undefined },
            attributes: ['id']
          }
        }
      ]);

      expect(sanitizer.ok).to.eql(true);
      expect(req.app.id).to.eql(test.id);
    });

    it('should not return if database row is missing', async function() {
      const sanitizer = new Sanitizer({ request: {
        app_wrong_customer_id: test.id,
        app_wrong_id: 0
      }, models: Models });

      const req = await sanitizer.check([
        {
          key: 'app_wrong_customer_id',
          type: 'integer',
          model: {
            name: 'tests',
            filters: { name: 'alma' },
            attributes: ['id']
          }
        },
        {
          key: 'app_wrong_id',
          type: 'integer',
          model: {
            name: 'tests',
            filters: { name: 'korte' },
            attributes: ['id']
          }
        }
      ]);

      expect(sanitizer.ok).to.eql(false);
      expect(req.app_wrong_customer_id).to.undefined;
      expect(req.app_wrong_id).to.undefined;
    });

  });

});

