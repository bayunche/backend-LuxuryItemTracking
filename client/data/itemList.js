const { DataTypes } = require("sequelize");
const sequelize = require("./database.js");
const ItemList = sequelize.define("ItemList", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  creater: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  itemName:{
    type:DataTypes.STRING,
    allowNull:false
  },
  itemId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  itemImage: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  itemDate: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  createTime: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  serialNumber: {
    type: DataTypes.BIGINT,
    allowNull: true,
  },
  // 1:已注册 2:已运输 3:已销售 4：已封存
  status: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
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
  updater:{
    type:DataTypes.STRING,
    allowNull:true
  },
  blockNumber:{
    type:DataTypes.BIGINT,
    allowNull:false,
  },
  transactionHash:{
    type:DataTypes.STRING,
    allowNull:false,
  },
  qrcode:{
    type:DataTypes.TEXT,
    allowNull:false,
  },
  salesTime:{
    type:DataTypes.DATE,
    allowNull:true,
  },
  salesPrice:{
    type:DataTypes.STRING,
    allowNull:true,
  },
  distributionChannel:{
    type:DataTypes.STRING,
    allowNull:true,
  },
  salesOutlet:{
    type:DataTypes.STRING,
    allowNull:true,
  },

});
sequelize.sync();
module.exports = ItemList;
