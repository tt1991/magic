'use strict';

const controllerFactory = require('boar-server').lib.controllerFactory;
const createVideoAction = require('./actions/create');

module.exports = controllerFactory.create(function(router) {
  router.post('/api/videos', createVideoAction.action);
});
