const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const config = require('./config/database');
let multipart = require('connect-multiparty');
let multipartMiddleware = multipart();


mongoose.connect(config.database);
let db = mongoose.connection;

// Check connection
db.once('open', function(){
  console.log('Connected to MongoDB');
});

// Check for DB errors
db.on('error', function(err){
  console.log(err);
});

// Init App
const app = express();

// Bring in Models
let Article = require('./models/article');

// *************************************************
let Opinion = require('./models/opinion');



// Load View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Body Parser Middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// Set Public Folder
app.use(express.static(path.join(__dirname, 'public')));

// Express Session Middleware
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}));

// Express Messages Middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// Express images Middleware         implementar middleware
//app.use(require('connect-multiparty')());
//app.use(function (req, res, next) {
//res.locals.messages = require('express-messages')(req, res);
  //next();
//});

// Express Validator Middleware
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

// Passport Config
require('./config/passport')(passport);
// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

app.get('*', function(req, res, next){
  res.locals.user = req.user || null;
  next();
});

// Home Route
app.get('/', function(req, res){
  Article.find({}, function(err, articles){
    if(err){
      console.log(err);
    } else {
      res.render('index', {
        title:'Articulos',
        articles: articles
      });
    }
  });
});

// Route Files
let articles = require('./routes/articles');
let users = require('./routes/users');
let opinions = require('./routes/opinions');
let upload = require('./routes/upload.js')
app.use('/articles', articles);
app.use('/users', users);



// ***********************************************
 app.use('/opinions', opinions);
// Home Route
app.get('/opinion', function(req, res){
  Opinion.find({}, function(err, articles){
    if(err){
      console.log(err);
    } else {
      res.render('index', {
        title:'Articulos',
      });
    }
  });
});

// indicamos que del fichero upload.js haga mención a la función upload, para cargar el formulario html
app.get('/add_article',upload.Uploads); 
// indicamos que del fichero upload.js haga mención a la función Uploads para subir la imagen.
//app.post('/add_article', upload.Uploads);

app.post('/add_article', multipartMiddleware, upload.Uploads);

// Start Server
app.listen(3000, function(){
  console.log('Server started on port 3000...');
});
