var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongo = require('mongodb');
var mongoose = require('mongoose');
var passportFacebook = require('passport-facebook');
var Handlebars = require('handlebars');
require('./config/passportFacebook')(passport)

//require('./models/User');

require('./config/passport')(passport);

const keys = require('./config/keys');

mongoose.Promise = global.Promise;

 


mongoose.connect('mongodb://anujsri:anuj1234@ds113003.mlab.com:13003/assignment',{ useNewUrlParser: true });
var db = mongoose.connection;

var auth = require('./routes/auth')
var routes = require('./routes/index');
var users = require('./routes/users');
var usertype = require('./routes/usertype');
var lender = require('./routes/lender');
var borrower = require('./routes/borrower');
// Init App
var app = express();

// View Engine
app.set('views', path.join(__dirname, 'views'));
app.engine('html', exphbs({ defaultLayout: 'layout' }));
app.set('view engine', 'html');

// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Express Session
app.use(session({
  secret: 'secret',
  saveUninitialized: true,
  resave: true
}));

// Passport init
app.use(passport.initialize());
app.use(passport.session());

// Express Validator
app.use(expressValidator({
  errorFormatter: function (param, msg, value) {
    var namespace = param.split('.')
      , root = namespace.shift()
      , formParam = root;

    while (namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param: formParam,
      msg: msg,
      value: value
    };
  }
}));

// Connect Flash
app.use(flash());

// Global Vars
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});
app.use('/auth', auth);
app.use('/', routes);
app.use('/users', users);
app.use('/usertype',usertype);
app.use('/lender',lender);
app.use('/borrower',borrower);

// Set Port
app.set('port', (process.env.PORT || 3000));

app.listen(app.get('port'), function () {
  console.log('Server started on port ' + app.get('port'));
});