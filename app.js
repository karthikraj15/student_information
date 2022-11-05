const express = require('express');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const path = require('path');
const session = require('express-session');
const mongoose = require('mongoose');
require('dotenv').config();

const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/users');

const students=require('./routes/students-route');
const courses=require('./routes/courses-route');
const users=require('./routes/users-route');

const app = express();
const port = process.env.PORT || 5000;


app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')))

const dbUrl = process.env.DB_URL || 'mongodb+srv://karthikraj15:Mongo%40123@cluster0.dsjkh4z.mongodb.net/studentInformation';
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Mongo Database connected");
});


const sessionConfig = {
  secret: 'thisshouldbeasecret',
  resave: false,
  saveUninitialized: true,
  cookie: {
      httpOnly: true,
      // secure: true,
      expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
      maxAge: 1000 * 60 * 60 * 24 * 7
  }
}

app.use(session(sessionConfig));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.user = null;
  if (req.isAuthenticated()) {
      res.locals.user = req.user.username;
  }
  next();
})


app.get('/', (req, res) => {
  res.render('home')
});

//routes
app.use('/students',students);
app.use('/courses',courses);
app.use('/',users);




app.listen(port, () => console.log(`Listening on port ${port}`));