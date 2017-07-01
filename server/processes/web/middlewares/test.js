'use strict';

module.exports = async function(next) {
  this.alma = 'ALMA';
  await next;
};
