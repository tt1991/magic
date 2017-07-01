'use strict';

module.exports = function(sequelize, DataTypes) {
  let Moves = sequelize.define('moves', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'name'
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      default: 'N/A',
      field: 'type'
    },
    level: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'level'
    },
    angle: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'angle'
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'description'
    },
    source: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'source'
    }
  }, {
    underscoredAll: true,
    underscored: true
  });

  return Moves;
};
