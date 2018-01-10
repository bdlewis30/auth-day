require('dotenv').config();
const express = require('express')
, cors = require('cors')
, session = require('express-session')
, bodyParser = require('body-parser')
, passport = require('passport')
, Auth0Strategy = require('passport-auth0');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use(session({
    secret: 'toocoolforschool',
    resave: false,
    saveUninitialized: true
}))

//Must be in this order
app.use(passport.initialize());
app.use(passport.session());

//Creating a new Auth0 Object
passport.use(new Auth0Strategy({
    domain: process.env.AUTH_DOMAIN,
    clientID: process.env.AUTH_CLIENT_ID,
    clientSecret: process.env.AUTH_CLIENT_SECRET,
    callbackURL: process.env.AUTH_CALLBACK,
    scope: 'openid profile'
}, function(accessToken, refreshToken, extraParams, profile, done){
    done(null, profile);
}))

// Authentication Middleware. Works with sessions to identify users. Stored on Req.user.
passport.serializeUser((profile, done) => {
    console.log(profile)
    done(null, profile)
})
passport.deserializeUser((profile, done) => {
    done(null, profile)
})

//This kicks off the firts argument above in passport.
app.get('/auth', passport.authenticate('auth0'));
//This kicks off the second argument, the callback function, in passport.
app.get('/auth/callback', passport.authenticate('auth0', {
    successRedirect: 'http://localhost:3000/'
}))



app.listen(process.env.SERVER_PORT, () => {console.log(`Listening on port ${process.env.SERVER_PORT}`)})
// Listen for the server port ---->, Callback function (specified in the docs)