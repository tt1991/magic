'use strict';

let Sanitizer = require('../../../lib/sanitizer');
let Models = require('../../../models');

module.exports = function(scheme) {
  return async function(next) {

    let sanitizer = new Sanitizer({
      request: this.request.body, query: this.request.query, params: this.params, models: Models
    });
    let inputData = await sanitizer.check(scheme(this));

    if (!sanitizer.ok) {
      return this.sendApiResponse(400, sanitizer.errors);
    }

    this.inputData = inputData;

    await next;
  };
};
