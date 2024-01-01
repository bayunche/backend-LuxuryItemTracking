const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
    dialect: "mysql",
    host: "localhost",
    username: "testuser",
    password: "12345678",
    database: "ddn",
  });

module.exports = sequelize;