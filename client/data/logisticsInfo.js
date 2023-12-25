const { DataTypes } = require("sequelize");
const sequelize = require("./database.js");


const logisiticsInfo = sequelize.define("logisiticsInfo", {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  logistics_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
  },
  itenId:{
    type:DataTypes.STRING,
    allowNull:false
  },
  // 1：正常 2：错误
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
  errorMessage:{
    type:DataTypes.STRING,
    allowNull:true
  }
});
sequelize.sync();
module.exports=logisiticsInfo 