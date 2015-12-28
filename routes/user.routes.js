var router = require("express").Router()


router.get("/signup", function (req, res, next) {
  res.render('signup', {})
})

module.exports = router
