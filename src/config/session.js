const session = require("express-session");
//lib para armazenar session no postgres
const pgSession = require("connect-pg-simple")(session);
const db = require("./db");

module.exports = session({
  secret: "abcasdasd",
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 30 * 24 * 60 * 60 * 1000,
  },
  store: new pgSession({
    pool: db,
  }),
});
