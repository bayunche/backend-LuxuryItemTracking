const { DataTypes } = require("sequelize");
const sequelize = require("./database.js");

const transactionLog = sequelize.define("transactionLog", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  creater: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  itemName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  itemId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  createTime: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  serialNumber: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  blockNumber: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  transactionHash: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});
sequelize.sync();
module.exports = transactionLog ;
