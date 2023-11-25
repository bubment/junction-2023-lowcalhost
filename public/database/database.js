const { Sequelize } = require('sequelize');

// Connect to database
const sequelize = new Sequelize('junction2023', 'postgres', 'Junction2023!', {
  host: 'junction2023.postgres.database.azure.com',
  dialect: 'postgres',
  dialectOptions: {
    ssl: true
  }
});

module.exports = { sequelize };