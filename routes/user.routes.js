const router = require('express').Router()
const passport = require('passport')
const expressValidator = require('express-validator')

const userController = require('../controllers/user.controller')()


router.use(expressValidator())

router.get("/signup", userController.getSignup)
router.post("/signup", userController.postSignup)

router.get("/login", userController.getLogin)
router.post("/login", passport.authenticate("local", {
  failureRedirect: "/login",
  failureFlash: true
}), userController.postLogin)

router.get("/logout", userController.userLogout)

module.exports = router
