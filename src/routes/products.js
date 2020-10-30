const express = require('express')
const routes = express.Router()
const multer = require("../app/middlewares/multer")

const ProductController = require('../app/controllers/ProductController')
const SearchController = require('../app/controllers/SearchController')
const {onlyUsers} = require('../app/middlewares/session')
//Search
routes.get('/search',SearchController.index)

//products
routes.get("/create", onlyUsers, ProductController.create)
routes.get('/:id', ProductController.show)
routes.get("/:id/edit", onlyUsers, ProductController.edit)

routes.post("/", onlyUsers, multer.array("photos", 6),ProductController.post)
//routes.delete("/", onlyUsers, ProductController.delete)

module.exports = routes