const { createConnection,DataSource } = require('typeorm');
const { User } = require('./entity/user');

async function connectDatabase() {
  try {
    const AppDataSource = new DataSource({
        "type": "mysql",
        "host": "localhost",
        "port": 3306,
        "username": "root",
        "password": "123456",
        "database": "ddn",
        "synchronize": true,
        "logging": true,
        "entities": ["data/entity/**/*.ts"],
        "migrations": ["data/migration/**/*.ts"],
        "subscribers": ["data/subscriber/**/*.ts"],
        "cli": {
          "entitiesDir": "data/entity",
          "migrationsDir": "data/migration",
          "subscribersDir": "data/subscriber"
        }
    })
   await AppDataSource.initialize()
    console.log('Connected to MySQL');

    return AppDataSource;
  } catch (error) {
    console.error('Error connecting to database:', error);
    throw error;
  }
}

async function closeDatabaseConnection(connection) {
  try {
    await connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error closing database connection:', error);
    throw error;
  }
}

async function insertUser(connection,data) {
  try {
    const userRepository = connection.getRepository(User);
    const user = new User();
    user=data
    await userRepository.save(user);
    console.log('User has been saved:', user);
  } catch (error) {
    console.error('Error inserting user:', error);
    throw error;
  }
}

async function getAllUsers(connection) {
  try {
    const userRepository = connection.getRepository(User);
    const users = await userRepository.find();
    console.log('Query Results:', users);
    return users;
  } catch (error) {
    console.error('Error querying users:', error);
    throw error;
  }
}

module.exports = {
  connectDatabase,
  closeDatabaseConnection,
  insertUser,
  getAllUsers,
};