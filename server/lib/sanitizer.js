'use strict';

class Sanitizer {

  constructor(opts) {
    this._opts = opts || {};
    this._errors = {};
  }

  get ok() {
    return Object.keys(this._errors).length === 0;
  }

  get errors() {
    const errors = [];
    Object.keys(this._errors).forEach((key)=>{
      errors.push(this._errors[key]);
    });
    return errors;
  }

  _addError(key, errorMessage) {
    this._errors[key] = errorMessage;
  }

  async checkType(key, value, rule) {
    if (typeof rule.defaultValue !== 'undefined') {
      if (typeof value === 'undefined') {
        value = rule.defaultValue;
      }
    }

    if (typeof rule.equalsTo !== 'undefined') {
      if (rule.equalsTo !== value) {
        this._addError(key, rule.errorMessage || key + ' contains invalid value');
      }
    }

    if (rule.allowEmpty === false && value === '') {
      this._addError(key, rule.errorMessage || key + ' must not be empty.');
    } else if (rule.allowEmpty === true && (value === '' || value === null)) {
      return value;
    }

    if (rule.type) {
      switch (rule.type) {
        case 'array':
          if (!(value instanceof Array)) {
            this._addError(key, rule.errorMessage || key + ' must be an array.');
          }
          break;
        case 'integer_string':
          if (typeof value === 'string' && value.match(/^\d+$/)) {
            value = parseInt(value, 10);
          } else if (typeof value === 'string') {
            // value = value;
          } else if (typeof value === 'number' && value === parseInt(value, 10)) {
            value = parseInt(value, 10);
          } else {
            this._addError(key, rule.errorMessage || key + ' must be integer or string.');
          }
          break;
        case 'integer':
          if (typeof value === 'string' && value.match(/^\d+$/)) {
            value = parseInt(value, 10);
          } else if (typeof value === 'number' && value === parseInt(value, 10)) {
            value = parseInt(value, 10);
          } else {
            this._addError(key, rule.errorMessage || key + ' must be integer.');
          }
          break;
        case 'string':
          if (typeof value !== 'string') {
            this._addError(key, rule.errorMessage || key + ' must be string.');
          }
          break;
        case 'object':
          if (typeof value !== 'object') {
            this._addError(key, rule.errorMessage || key + ' must be an object.');
          }
          break;
        case 'boolean':
          if (typeof value !== 'boolean') {
            if (typeof value === 'string' && (value === 'true' || value === 'false')) {
              value = (value === 'true');
            } else {
              this._addError(key, rule.errorMessage || key + ' must be a boolean.');
            }
          }
          break;
        default:
          throw new Error('Sanitizer: unknown type rule: ' + rule.type);
      }
    }


    return value;
  }

  async checkModel(key, value, rule) {
    if (rule.model) {
      const model = this._opts.models[rule.model.name];
      const query = { where: rule.model.filters || {} };

      if (rule.model.optionalFilters) {
        for (let columnName in rule.model.optionalFilters) {
          if (typeof rule.model.optionalFilters[columnName] !== 'undefined') {
            query.where[columnName] = rule.model.optionalFilters[columnName];
          }
        }
      }

      if (rule.model.attributes) query.attributes = rule.model.attributes;

      query.where[rule.model.columnName || 'id'] = value;

      value = await model.findOne(query);

      if (value === null) {
        this._addError(key, rule.errorMessage || key + ' must be a valid ' + rule.model.name + ' ID.');
      }
    }

    return value;
  }

  async check(rules) {
    let response = {};

    for (let i = 0; i < rules.length; i++) {
      const rule = rules[i];
      const key = rule.key;
      let value;
      if (key[0] === ':') {
        value = this._opts.params[key.substr(1)];
      } else if (key[0] === '?') {
        value = this._opts.query[key.substr(1)];
      } else {
        value = this._opts.request[key];
      }
      const errorCount = Object.keys(this._errors).length;

      const checks = ['checkType', 'checkModel'];

      if (rule.optional && typeof value === 'undefined') continue;

      for (let j = 0; j < checks.length; j++) {
        if (errorCount === Object.keys(this._errors).length) {
          value = await this[checks[j]](key, value, rule);
        }
      }

      if (errorCount === Object.keys(this._errors).length) {
        if (rule.as) {
          response[rule.as] = value;
        } else {
          response[key] = value;
        }
      }
    }

    return response;
  }

}

module.exports = Sanitizer;
