const { DataTypes } = require("sequelize");
const sequelize = require("./database.js");
const ItemList = sequelize.define("ItemList", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userName: {
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
  itemImage:{
    type:DataTypes.STRING,
    allowNull:false
  },
  itemDate: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  createTime: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  serialNumber: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  
});
sequelize.sync();
module.exports = ItemList;
