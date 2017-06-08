'use strict';
require('dotenv').config({ silet: true });

const co = require('co');

co(function *() {
}).then(() => {
  console.log('ok');

  process.exit(0);
}).catch(error => {
  console.log(error);

  process.exit(1);
});
