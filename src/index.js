const express = require("express");
const nunjucks = require("nunjucks");
const routes = require("./routes");
const methodOverride = require("method-override");
const session = require("./config/session");
const PORT = process.env.PORT || 3000;

const server = express();

server.use(session);

//create var global to validate user anywhere
server.use((req,res,next) => {
  res.locals.session = req.session
  next()
})

server.use(methodOverride("_method"));
server.use(express.urlencoded({ extended: true }));
server.use(routes);

server.use(express.static("public"));
server.set("view engine", "njk");
nunjucks.configure("src/app/views", {
  express: server,
  noCache: true,
  autoescape: false,
});

server.listen(PORT, () => {
  console.log("server running on port: ", PORT);
});
