'use strict';

const controllerFactory = require('boar-server').lib.controllerFactory;
const createVideoAction = require('./actions/create');
// const sanitizer = require('../../middlewares/sanitizer');

module.exports = controllerFactory.create(function(router) {
  router.post('/api/videos', /*sanitizer(createVideoAction.scheme),*/ createVideoAction.action);
});
