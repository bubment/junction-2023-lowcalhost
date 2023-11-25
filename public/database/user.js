const { Sequelize } = require('sequelize');
const database = require("./database");

const User = database.sequelize.define(
  "user",
  {
    username: {
      type: Sequelize.STRING,
    },
    password: {
      type: Sequelize.STRING,
    },
    voice_sample: {
      type: Sequelize.BLOB,
    },
    verification_sample: {
      type: Sequelize.BLOB,
    },
  },
  {
    tableName: "user",
    timestamps: false,
    paranoid: true,
    underscored: true,
    freezeTableName: true,
  }
);

module.exports = User;