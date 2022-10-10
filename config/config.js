require("dotenv").config();

const development = {
    "username": process.env.USERNAME,
    "password": process.env.PASSWORD,
    "database": "4w-homework",
    "host"    : process.env.ENDPOINT,
    "dialect" : "mysql"
};

const test = {
    "username": process.env.USERNAME,
    "password": process.env.PASSWORD,
    "database": "database_test",
    "host"    : process.env.ENDPOINT,
    "dialect" : "mysql"
};

const production = {
    "username": process.env.USERNAME,
    "password": process.env.PASSWORD,
    "database": "database_production",
    "host"    : process.env.ENDPOINT,
    "dialect" : "mysql"
};

module.exports = {development, production, test};