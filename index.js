/*
 * index.js
 * A simple node application which lets the users sign up and take the peace pledge
 * Authors: [Hannan Ali (ali.abdulhannan@gmail.com)]
 *
 */
const  express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const session = require('express-session')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

const User = require('./models/user')

const app = express()

// environment specific configurations
if (process.env.NODE_ENV == 'development') {
  // using morgan development logger
  app.use(morgan('dev', {}))

  // using config.js file for setting up environment variables
  require('./config')()
}
else if (process.env.NODE_ENV == 'production') {
  app.use(morgan('combined', {}))
}
else {
  throw new Error('NODE_ENV not specified')
  process.exit(1)
}


const PORT = process.env.PORT || 3000
const HOST = process.env.HOST || '0.0.0.0'
const MONGODB_CONNECTION_URL = process.env.MONGODB_CONNECTION_URL

// connecting with the database
mongoose.connect(MONGODB_CONNECTION_URL, function (error) {
  if (error) {
    console.error(error)
    process.exit(1)
  }
  else {
    console.log('Successfully connected to the database')
  }
})


// LocalStrategy for the passport js now
passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
},
  function (email, password, done) {
    console.log(email)
    User.findOne({
      email: email
    }, function (error, user) {
      if (error) {
        console.error(error)
        return done(error)
      }
      if (!user) {
        console.log('no user found')
        return done(null, false, {message: 'Incorrect Username'})
      }
      user.comparePassword(password, function (error, isMatch) {
        if (error) {
          return done(error)
        }
        if (isMatch) {
          return done(null, user)
        }
        else {
          return done(null, false, {message: 'Incorrect Password'})
        }
      })
    })
}))

// bodyParser parsing
app.use(bodyParser.json())
// express session
app.use(session({secret: 'world peace for life'}))

// setting up passportjs
app.use(passport.initialize())
app.use(passport.session())

passport.serializeUser(function (user, done) {
  done(null, user.id)
})

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user)
  })
})

// static file serving
app.use(express.static(__dirname + '/public'))

// view engine is jade
app.set('views', __dirname + '/views')
app.set('view engine', 'jade')


// set up routers here
app.use(require('./routes/index.router'))
app.use(require('./routes/user.routes'))

// listening after all this fuss
app.listen(PORT, HOST, function (error) {
  if (!error) {
    console.log(`server is listening on PORT=${PORT} and HOST=${HOST}`)
  }
  else {
    console.log('error while listening to the server')
  }
})
