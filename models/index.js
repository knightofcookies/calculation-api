const { Sequelize } = require("sequelize");
const UserModel = require("./user");
const LogModel = require("./log");

const isTest = process.env.NODE_ENV === "test";
const dbFile = isTest
  ? process.env.TEST_SQLITE_DATABASE
  : process.env.SQLITE_DATABASE;

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: `./${dbFile}`,
  logging: false, // Disabled logging for cleaner test output
});

const User = UserModel(sequelize);
const Log = LogModel(sequelize);

// Associations
User.hasMany(Log, { foreignKey: "userId" });
Log.belongsTo(User, { foreignKey: "userId" });

module.exports = {
  sequelize,
  User,
  Log,
};
