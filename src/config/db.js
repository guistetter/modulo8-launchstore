require("dotenv/config");
const { Pool } = require("pg");
module.exports = new Pool({
  user: "postgres",
  password: process.env.POSTGRESS_PASS,
  host: "localhost",
  port: "5432",
  database: "launchstoreDb",
});
