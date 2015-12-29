const User = require("../models/user")

module.exports = function () {
  function getIndex(req, res, next) {
    User.count({}, function (error, count) {
      if (error) {
        count = "unknown"
      }
      res.render("index", {
        user: req.user,
        info: req.flash('info'),
        count: count
      })
    })
  }


  // shows all the other
  function getPledgers(req, res, next) {
    if (req.user && req.isAuthenticated()) {
      User.find({}, function (error, users) {
        res.render("peacepledgers", {
          user: req.user,
          users: users
        })
      })
    }
    else {
      req.flash("info", "You need to first login in order to view all the pledgers")
      res.redirect("/login")
    }
  }

  return {
    getIndex: getIndex,
    getPledgers: getPledgers
  }
}
