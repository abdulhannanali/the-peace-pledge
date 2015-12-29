const router = require('express').Router()
const indexController = require("../controllers/index.controllers")()

router.get("/", indexController.getIndex)

module.exports = router
