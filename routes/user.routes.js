const router = require('express').Router()
const passport = require('passport')

const userController = require('../controllers/user.controller')()


router.get("/signup", userController.getSignup)
router.post("/signup", userController.postSignup)

router.get("/login", userController.getLogin)
router.post("/login", passport.authenticate("local"), userController.postLogin)

module.exports = router