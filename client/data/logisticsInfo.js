const { DataTypes } = require("sequelize");
const sequelize = require("./database.js");

const logisiticsInfo = sequelize.define("logisiticsInfo", {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  logistics_id: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  itemId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  // 运输状态 0为运输结束 1为运输中 2为运输成功 3为出现运输错误
  logistics_status: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
  },
  createTime: { type: DataTypes.DATE, allowNull: false },
  creater: { type: DataTypes.STRING, allowNull: false },
  startPoint: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  endPoint: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  TransportWay: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  TransportNumber: {
    //运输单号
    type: DataTypes.STRING,
    allowNull: true,
  },
  TransportDate: {
    //运输日期
    type: DataTypes.STRING,
    allowNull: true,
  },
  TransportCompany: {
    //运输公司
    type: DataTypes.STRING,
    allowNull: true,
  },
  errorMessage: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  transactionHash: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  blockNumber: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  timestamp: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
});
sequelize.sync();
module.exports = logisiticsInfo;
