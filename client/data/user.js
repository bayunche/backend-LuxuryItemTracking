// models/user.js

const { DataTypes } = require("sequelize");
const sequelize = require("./database.js");

const User = sequelize.define("User", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  passwordF: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  permissions: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  loginTime: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  privateKey: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  balance: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  avatar: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});
sequelize.sync();
module.exports = User;
