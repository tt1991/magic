'use strict';

module.exports = {
  up: function(queryInterface) {
    return queryInterface.addIndex(
      'moves',
      ['name', 'type'],
      {
        indicesType: 'UNIQUE'
      }
    );
  },
  down: function(queryInterface) {
    return queryInterface.removeIndex(
      'moves',
      ['name', 'type']
    );
  }
};
