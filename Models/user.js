const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');
const app = express();

// Middleware setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Session setup for login
app.use(session({ secret: 'your-secret-key', resave: true, saveUninitialized: true }));

// MongoDB setup
mongoose.connect('mongodb://localhost/equest', { useNewUrlParser: true, useUnifiedTopology: true });

// Passport configuration (for user authentication)
require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());

// Serve static files like CSS, JavaScript, images
app.use(express.static('public'));

// Set up view engine (if using EJS)
app.set('view engine', 'ejs');

// Routes
const horseRoutes = require('./routes/horseRoutes');
const userRoutes = require('./routes/userRoutes');

app.use('/horses', horseRoutes);
app.use('/users', userRoutes);

// Home route
app.get('/', (req, res) => {
    res.render('index');  // Render the main page (e.g., homepage for horse listings)
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
