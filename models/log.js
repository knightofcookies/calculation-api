const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Log = sequelize.define("Log", {
    timestamp: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    method: {
      type: DataTypes.STRING,
    },
    path: {
      type: DataTypes.STRING,
    },
    statusCode: {
      type: DataTypes.INTEGER,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true, // For unauthenticated requests
    },
    ipAddress: {
      type: DataTypes.STRING,
    },
    requestBody: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    responseBody: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  });

  return Log;
};
