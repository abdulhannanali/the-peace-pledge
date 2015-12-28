/*
 * user.controller.js
 * controller for user routes in order to deal with the
 * functions regarding the user such as login, signup, signout etc
 */

const User = require("../models/user")
const passport = require('passport')

module.exports = function () {

  function getLogin(req, res, next) {
    if (req.user) {
      res.redirect("/")
    }
    else {
      res.render("login", {})
    }
  }

  // authenticate and submit a login here
  function postLogin(req, res, next) {
    if (req.user) {
      res.redirect("/", {})
    }
    else {
      res.redirect("/login")
    }
  }

  // controller for signing up the new user and redirecting the user
  function postSignup(req, res, next) {
    if (req.user) {
      res.redirect("/")
    }
    else {
      User.findOne({email: req.body.email}, function (error, user) {
        if (error) return next(error)
        if (!user) {
          var user = new User({email: req.body.email, password: req.body.password})
          user.save().then(function (data) {
            if (data) {
              console.log(data)
            }
          })
        }
        else {
          res.redirect("/login")
        }
      })
    }
  }


  // controller for rendering the signup page
  function getSignup(req, res, next) {
    res.render("signup", {
      user: req.user
    })
  }

  return {
    getSignup: getSignup,
    postSignup: postSignup,
    getLogin: getLogin,
    postLogin: postLogin
  }
}
