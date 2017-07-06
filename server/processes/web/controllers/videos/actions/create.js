'use strict';
const videosHandler = require('../../../../../lib/videos/videoshandler').create();

const validateRequest = function(data) {
  if (typeof data.name !== 'string') {
    throw Error('Invalid name');
  }

  return data;
};

module.exports = {
  // eslint-disable-next-line
  scheme: request => {
    return [
      { key: 'name', as: 'name', type: 'string', optional: false }
    ];
  },

  action: async function() {
    const requestData = this.request.body;
    let hasNewMove = false;

    try {
      validateRequest(requestData);
    } catch (error) {
      return this.sendApiResponse(400, error.message);
    }

    try {
      hasNewMove = await videosHandler.handle(requestData);
    } catch (error) {
      return this.sendApiResponse(500, error.message);
    }

    return this.sendApiResponse(200, 'OK', { hasNewMove });
  }
};
