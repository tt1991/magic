'use strict';

const getNormalResponse = function(messages) {
  if (messages[0] === '') return {};
  return {
    'message': messages.join('; ')
  };
};

const getErrorResponse = function(messages) {
  const response = { errors: [] };
  messages.forEach((message) => {
    response.errors.push({ message: message });
  });
  return response;
};

const send = function(status, messages, data) {
  let response;

  this.response.status = status;

  if (typeof messages === 'undefined') {
    return;
  }
  if (typeof messages === 'string') {
    messages = [messages];
  }

  if (status >= 200 && status < 300) {
    response = this.body = getNormalResponse(messages);
  } else {
    response = this.body = getErrorResponse(messages);
  }

  return Object.assign(response, data);
};

module.exports = {
  addHandler: (app) => {
    app.context.sendApiResponse = send;
  }
};
