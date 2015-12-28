/*
 * user.controller.js
 * controller for user routes in order to deal with the
 * functions regarding the user such as login, signup, signout etc
 */

const User = require("../models/user")
const passport = require('passport')
const fs = require('fs')

const countryCodes = JSON.parse(fs.readFileSync("./data/viewsData/countrycodes.json", "utf-8"))

module.exports = function () {

  // getting the login page
  function getLogin(req, res, next) {
    if (req.isAuthenticated) {
      return res.redirect("/")
    }
    res.render("login", {
      user: req.user
    })
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
    if (!req.isAuthenticated()) {
      res.render("signup", {
        user: req.user,
        countries: countryCodes
      })
    }
    else {
      // if request is authenticated redirects to the home page
      req.flash("info", "You are already signed up Peace Lover")
      res.redirect("/")
    }
  }

  // logouts the user if authenticated or not and redirects to the homepage
  function userLogout(req, res, next) {
    if (req.isAuthenticated()) {
      req.logout()
      req.flash("info", "Thanks again! For signing up the pledge! You have been successfully logged out")
      res.redirect("/")
    }
  }

  return {
    getSignup: getSignup,
    postSignup: postSignup,
    getLogin: getLogin,
    postLogin: postLogin,
    userLogout: userLogout
  }
}
