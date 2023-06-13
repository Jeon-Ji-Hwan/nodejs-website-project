var express = require('express')
var app = express()
var db = require('../lib/db');
var topic = require('../lib/topic');
var bodyParser = require('body-parser');
var session = require('express-session');
var MysqlStore = require('express-mysql-session')(session);
var flash = require('connect-flash');


app.use(session({
    secret: 'qwerasd32eafff4wfa2a',
    resave: false,
    saveUninitialized: true,
    store: new MysqlStore({
        host: '127.0.0.1',
        user: 'nodejs',
        password: '00wlghks**',
        database: 'opentutorials'
    })
}));

app.use(flash());
app.use(bodyParser.urlencoded({ extended: false }));

var passport = require('passport')
    , LocalStrategy = require('passport-local').Strategy;

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
    done(null, user.email);
});
  
passport.deserializeUser(function(id, done) {
    db.query('SELECT * FROM user WHERE email = ?',[id],function(error,user){
        done(null,user[0]);
    })
});
  

passport.use(new LocalStrategy(
    {
        usernameField: 'email',
        passwordField: 'password'
    },
    function (username, password, done) {
        db.query('SELECT * FROM user WHERE email=?',[username],function(error,result){
            console.log(result[0]);
            if(!result[0]) {
                return done(null, false, {
                    message: 'Incorrect username.'
                });
            }
            else if(username === result[0].email){
                if(password === result[0].password){
                    return done(null, result[0]);
                } else if(!result[0].password || password != result[0].password){
                    return done(null, false, {
                        message: 'Incorrect password.'
                    });
                }
            }
        })
    }
));
      
app.post('/login_process',
passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}));





app.get('/', function (request, response) {
    topic.home(request, response)
});

app.get('/page/:pageId', function (request, response) {
    topic.page(request, response);
});

app.get('/create', function (request, response) {
    topic.create(request, response);
})

app.post('/create_process', function (request, response) {
    topic.create_process(request, response);
})

app.get('/update/:pageId', function (request, response) {
    topic.update(request, response);
})

app.post('/update_process', function (request, response) {
    topic.update_process(request, response);
})

app.post('/delete_process', function (request, response) {
    topic.delete_process(request, response);
})

app.get('/login', function (request, response) {
    topic.login(request,response);
})

app.get('/logout_process', function (request, response) {
    topic.logout_process(request,response);
})

app.get('/register', function(request,response){
    topic.register(request,response);
})

app.post('/register_process',function(request,response){
    topic.register_process(request,response);
})
app.listen(3000, function () {
    console.log('yeah!')
});


