
const { Sequelize, DataTypes } = require('sequelize');
const config = require('../config/config.json').development;

const sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  dialect: config.dialect
});

const User = require('./User.js')(sequelize, DataTypes);

sequelize.sync();

module.exports = {
  sequelize,
  User
};