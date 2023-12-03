// const { Sequelize, DataTypes } = require("sequelize");
const  User  = require("./user");
const sequelize = require("./database");

async function connectDatabase() {
  try {
    // console.log("Connected to MySQL");
    // sequelize.sync();
    await sequelize.authenticate();
    console.log("Connected to MySQL");
    return sequelize;
  } catch (error) {
    console.error("Error connecting to database:", error);
    throw error;
  }
}
async function closeDatabaseConnection(connection) {
  try {
    if (connection.isConnected) {
      await connection.close();
      console.log("Database connection closed");
    } else {
      console.log("Database connection is not established");
    }
  } catch (error) {
    console.error("Error closing database connection:", error);
    // 可以选择不再抛出错误，而是在这里处理
    throw error;
  }
}

const { Op } = require("sequelize");

// 创建用户
async function createUser(userName, password, userId, permissions, loginTime) {
  const user = await User.create({
    userName,
    passwordF: password,
    userId,
    permissions,
    loginTime,
  });

  return user;
}

// 查询所有用户
async function getAllUsers() {
  const users = await User.findAll();

  return users;
}

// 查询单个用户
async function getUserById(userId) {
  const user = await User.findByPk(userId);

  return user;
}

// 更新用户
async function updateUser(userId, updatedFields) {
  const user = await User.findByPk(userId);

  if (user) {
    await user.update(updatedFields);
    return user;
  }

  return null;
}

// 删除用户
async function deleteUser(userId) {
  const user = await User.findByPk(userId);

  if (user) {
    await user.destroy();
    return true;
  }

  return false;
}

module.exports = {
  connectDatabase,
  closeDatabaseConnection,
  createUser,
  getUserById,
  getAllUsers,
  updateUser,
  deleteUser,
};
