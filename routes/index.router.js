const router = require('express').Router()
const indexController = require("../controllers/index.controllers")()

router.get("/", indexController.getIndex)
router.get("/peacepledgers", indexController.getPledgers)

module.exports = router
