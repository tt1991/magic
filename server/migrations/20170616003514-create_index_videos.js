'use strict';

module.exports = {
  up: function(queryInterface) {
    return queryInterface.addIndex(
      'videos',
      ['name', 'link'],
      {
        indicesType: 'UNIQUE'
      }
    );
  },
  down: function(queryInterface) {
    return queryInterface.removeIndex(
      'videos',
      ['name', 'link']
    );
  }
};
