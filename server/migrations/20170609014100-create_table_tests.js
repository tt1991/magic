'use strict';

module.exports = {
  up: function(queryInterface, Sequelize) {

    return queryInterface.createTable('tests', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: Sequelize.STRING,
        field: 'name'
      },
      createdAt: {
        type: Sequelize.DATE,
        field: 'created_at',
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        field: 'updated_at',
        allowNull: false
      }
    });
  },

  down: function(queryInterface) {
    return queryInterface.dropTable('tests');
  }
};
