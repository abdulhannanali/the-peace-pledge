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
const flash = require('express-flash')
const favicon = require('serve-favicon')

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
  // app.use(httpsSecure)
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
        return done(null, false, {message: 'The email is not registered! Please sign up!'})
      }
      user.comparePassword(password, function (error, isMatch) {
        if (error) {
          return done(error)
        }
        if (isMatch) {
          return done(null, user)
        }
        else {
          return done(null, false, {message: 'Your password is wrong peace lover'})
        }
      })
    })
}))



// serve favicon
app.use(favicon(__dirname + "/public/dove.png"))

// bodyParser parsing
app.use(bodyParser.json())
app.use(bodyParser({extended: true}))
// express session
app.use(session({secret: 'world peace for life'}))
app.use(flash())


// setting up passportjs
app.use(passport.initialize())
app.use(passport.session({
  resave: true,
  saveUninitialized: true
}))

passport.serializeUser(function (user, done) {
  console.log("serializing")
  done(null, user.id)
})

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    console.log("deserializing")
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


// not found middleware
app.use(function (req, res, next) {
  res.status(404)
  res.render("notfound", {})
})

// error middleware
app.use(function (error, req, res, next) {
  console.error(error)
  res.status(500)
  res.render("error", {
  })
})

// middleware to make all the requests the url secure by redirecting them
// to https
function httpsSecure(req, res, next) {
  var protoUsed = req.headers["x-forwarded-proto"]
  if (protoUsed == "http") {
    console.log(protoUsed)
    var redirectUrl = `https://${req.get('host')}${req.originalUrl}`
    console.log(redirectUrl)
    res.redirect(redirectUrl)
  }
}

// listening after all this fuss
app.listen(PORT, HOST, function (error) {
  if (!error) {
    console.log(`server is listening on PORT=${PORT} and HOST=${HOST}`)
  }
  else {
    console.log('error while listening to the server')
  }
})
