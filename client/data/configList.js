const { DataTypes } = require("sequelize");
const sequelize = require("./database.js");

const configList = sequelize.define("configList", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  TopUp: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
});
sequelize.sync();
module.exports = configList ;