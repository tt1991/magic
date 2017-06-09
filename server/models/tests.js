'use strict';

module.exports = function(sequelize, DataTypes) {
  let Tests = sequelize.define('tests', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      field: 'name'
    }
  }, {
    underscoredAll: true,
    underscored: true
  });

  return Tests;
};
