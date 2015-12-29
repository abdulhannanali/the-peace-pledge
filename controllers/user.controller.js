/*
 * user.controller.js
 * controller for user routes in order to deal with the
 * functions regarding the user such as login, signup, signout etc
 */

const User = require("../models/user")
const passport = require('passport')
const fs = require('fs')
const crypto = require('crypto')

const countryCodes = JSON.parse(fs.readFileSync("./data/viewsData/countrycodes.json", "utf-8"))

module.exports = function () {

  // getting the login page
  function getLogin(req, res, next) {
    // console.log(req.flash("error"))
    if (req.isAuthenticated()) {
      req.flash("info", "you are already logged in")
      return res.redirect("/")
    }
    else {
      res.render("login", {
        user: req.user,
        info: req.flash("info"),
        error: req.flash("error")
      })
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

    req.checkBody('country', "No country provided")
      .notEmpty()

    var errors = req.validationErrors()
    if (errors) {
      req.flash("validationErrors", errors)
      console.error(errors)
      return res.redirect("/signup")
    }

    req.sanitizeBody("email").normalizeEmail()

    if (req.user) {
      req.flash("info", "You are already signed in as " + req.user.email)
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
            hash: hashGenerator(req.body.email)
          })

          user.save(function (err, result) {
            if (err) return next(err)
            req.flash("info", "Congrats! You have signed up successfully. Now Login to your account!")
            return res.redirect("/")
          })
        }
        else {
          res.redirect("/login")
        }
      })
    }
  }

  // generates a hash from email
  function hashGenerator(email) {
    if (email) {
      var hash = crypto.createHash("md5").update(email).digest("hex")
      return hash
    }
    else {
      return ""
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
      var user = req.user
      req.logout()
      res.render("logout", {
        loggedOut: user
      })
    }
    else {
      req.flash("info", "You need to login before logging out!")
      res.redirect("/login")
    }
  }

  // getUserInfo
  // display the info a user
  // authentication required
  function getUserInfo(req, res, next) {

    req.checkParams("id", "Invalid Object Id")
      .notEmpty().isLength(0, 35)

    var errors = req.validationErrors()
    if (errors) {
      return next()
    }

    if (req.isAuthenticated()) {
      User.findOne({_id: req.params.id}, function (error, result) {
        if (error) {
          return next(error)
        }
        else if (!result) {
          return next()
        }
        else {
          res.render("user", {
            user: result
          })
        }
      })
    }
    else {
      req.flash("info", "You need to be loggedin in order to view the user information")
      res.redirect("/login")
    }
  }

  return {
    getSignup: getSignup,
    postSignup: postSignup,
    getLogin: getLogin,
    userLogout: userLogout,
    getUserInfo: getUserInfo
  }
}
