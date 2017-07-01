'use strict';

module.exports = {
  up: function(queryInterface, Sequelize) {

    return queryInterface.createTable('moves', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        field: 'name'
      },
      type: {
        type: Sequelize.STRING,
        allowNull: false,
        default: 'N/A',
        field: 'type'
      },
      level: {
        type: Sequelize.STRING,
        allowNull: true,
        field: 'level'
      },
      angle: {
        type: Sequelize.STRING,
        allowNull: true,
        field: 'angle'
      },
      description: {
        type: Sequelize.STRING,
        allowNull: true,
        field: 'description'
      },
      source: {
        type: Sequelize.STRING,
        allowNull: true,
        field: 'source'
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        field: 'created_at'
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        field: 'updated_at'
      }
    });
  },

  down: function(queryInterface) {
    return queryInterface.dropTable('moves');
  }
};
