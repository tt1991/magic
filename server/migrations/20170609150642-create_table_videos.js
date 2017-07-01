'use strict';

module.exports = {
  up: function(queryInterface, Sequelize) {

    return queryInterface.createTable('videos', {
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
      link: {
        type: Sequelize.STRING,
        allowNull: false,
        default: 'N/A',
        field: 'link'
      },
      duration: {
        type: Sequelize.INTEGER,
        allowNull: true,
        field: 'duration'
      },
      moves: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: true,
        field: 'moves'
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
    return queryInterface.dropTable('videos');
  }
};
