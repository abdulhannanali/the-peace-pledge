var router = require('express').Router()

router.get("/login", function (req, res, next) {
  console.log(req)
})

module.exports = router
