
module.exports = function () {
  function getIndex(req, res, next) {
    console.log(req.user)
    res.render("index", {
      user: req.user
    })
  }

  return {
    getIndex: getIndex
  }
}
