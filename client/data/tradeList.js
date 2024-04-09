const { DataTypes } = require("sequelize");
const sequelize = require("./database.js");
const tradeList = sequelize.define("tradeList", {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  out_trade_no: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  userId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  balance: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  //交易前剩余余额
  beforeBalance: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  //交易后剩余余额
  afterBalance: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  tradeTime: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  trueValue: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});
sequelize.sync();
module.exports = tradeList;
