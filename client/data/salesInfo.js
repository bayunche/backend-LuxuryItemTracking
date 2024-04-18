const { DataTypes } = require("sequelize");
const sequelize = require("./database.js");

const salesInfo = sequelize.define("salesInfo", {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  salesId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  itemId:{
    type:DataTypes.STRING,
    allowNull:false
  },
  salesStatus:{
    type:DataTypes.STRING,
    allowNull:false
  },
  salesTime:{
    type:DataTypes.DATE,
    allowNull:false
  },
  salesPrice:{
    type:DataTypes.STRING,
    allowNull:false
  },
  distributionChannel:{
    type:DataTypes.STRING,
    allowNull:false
  },
  salesOutlet:{
    type:DataTypes.STRING,
    allowNull:false,
  },
  transactionHash:{
   type:DataTypes.STRING,
   allowNull:false
  },
  blockNumber:{
    type:DataTypes.BIGINT,
    allowNull:false
  },
  timestamp:{ 
    type:DataTypes.BIGINT,
    allowNull:false
  },
  remark:{
    type:DataTypes.STRING,
    allowNull:true
  }

});
sequelize.sync();
module.exports=salesInfo 