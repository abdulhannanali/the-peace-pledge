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
    if (req.isAuthenticated()) {
      return res.redirect("/")
    }
    else {
      res.render("login", {
        user: req.user
      })
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
    // perform all the validations
    req.checkBody('email', "No email provided")
      .notEmpty()
      .withMessage("Invalid Email Entered").isEmail()
      .withMessage("Email must be between 6 and 50 characters in length").isLength(6, 50)

    req.checkBody('password', "No password provided").notEmpty()
      .withMessage("password must be between 8 and 23 characters in length").isLength(8, 23)

    req.checkBody('name', "No name provided").notEmpty()
    req.checkBody('name', "Name can be atmost 50 characters in length").isLength(0, 50)
    req.checkBody('name', "Name can only contain letters").isAlpha()

    req.checkBody('country', "No country provided")
      .notEmpty()

    var errors = req.validationErrors()
    if (errors) {
      req.flash("validationErrors", errors)
      console.error(errors)
      return res.redirect("/signup")
    }

    if (req.user) {
      console.log(req.user)
      res.redirect("/")
    }
    else {
      User.findOne({email: req.body.email}, function (error, user) {
        if (error) return next(error)
        if (!user) {
          var user = new User({
            email: req.body.email,
            password: req.body.password,
            "profile.name": req.body.name,
            "profile.country": req.body.country,
          })

          user.save(function (err, result) {
            console.log(result)
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
        countries: countryCodes,
        validationErrors: req.flash("validationErrors")
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
