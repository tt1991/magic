'use strict';

module.exports = function(sequelize, DataTypes) {
  let Videos = sequelize.define('videos', {
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
    link: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'link'
    },
    duration: {
      type: DataTypes.TIME,
      allowNull: true,
      field: 'duration'
    },
    moves: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      field: 'moves'
    }
  }, {
    underscoredAll: true,
    underscored: true
  });

  return Videos;
};
