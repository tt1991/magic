'use strict';

let fs = require('fs');
let path = require('path');
let Sequelize = require('sequelize');
let basename = path.basename(module.filename);
let env = process.env.NODE_ENV || 'development';
let config = require(__dirname + '/../config/database.json')[env];
let db = {};

let sequelize = config.use_env_variable ?
  new Sequelize(process.env[config.use_env_variable], config) :
  new Sequelize(config.database, config.username, config.password, config);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

fs
  .readdirSync(__dirname)
  .filter(function(file) {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js') &&
      (file.slice(-8) !== '.spec.js');
  })
  .forEach(function(file) {
    var model = sequelize.import(path.join(__dirname, file));

    db[model.name] = model;
  });

Object.keys(db).forEach(function(modelName) {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;
