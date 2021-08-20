const {Sequelize} = require('sequelize');
const db = new Sequelize('postgres://postgres:Rocket39@localhost:5432/WOL-Server');

module.exports = db;