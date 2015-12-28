/*
 * user.js
 * mongoose model for User
 * saves the password using bcrypt instead of plain passwords
 */

const bcrypt = require('bcrypt')
const mongoose = require('mongoose')

const SALT_WORK_FACTOR = 10

var userSchema = mongoose.Schema({
    email: {
      type: String,
      unique: true,
      lowercase: true,
      required: true
    },

    password: {
      type: String,
      required: true
    },

    profile: {
    name: { type: String, default: '' },
    country: {type: String, default: ''}
  }

})

// hash the password before saving
userSchema.pre('save', function (next) {
  var user = this
  if (!user.isModified('password')) {
    return next()
  }

  // generating a salt
  bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
    if (err) {
      return next(err)
    }

    bcrypt.hash(user.password, salt,  function (err, hash) {
      if (err) {
        return next(err)
      }

      // hash the password along with our salt
      user.password = hash;
      next();

    })
  })
})

userSchema.methods.comparePassword  = function (candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
    if (err)  {
      return cb(err)
    }
    cb(null, isMatch)
  })
}

module.exports = mongoose.model("User", userSchema)
