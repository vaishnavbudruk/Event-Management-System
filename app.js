const express = require('express');
const path = require('path');
const app = express();
const port = 8080;

// Mongoose
var mongoose = require("mongoose");
const bodyparser = require("body-parser");
mongoose.connect('mongodb://localhost/IWP1', { useNewUrlParser: true, useUnifiedTopology: true });

// Define Mongoose Schema
const IWP1Schema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    regno: {
        type: String,
        unique: true,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    }
});

const Profile = mongoose.model('Profile', IWP1Schema);


//Express Specific stuff
app.use('/static', express.static('static')); //For serving static files
app.use(express.urlencoded())

//PUG SPecific stuff

app.set('view engine', 'pug'); // set template engine as pug
app.set('views', path.join(__dirname, 'views')); // set the views directory

//ENDPOINTS
app.get('/', (req, res) => {
    const params = {}
    res.status(200).render('home.pug', params);
});
app.get('/merch', (req, res) => {
    const params = {}
    res.status(200).render('merch.pug', params);
});

app.get('/profile', (req, res) => {
    const params = {}
    res.status(200).render('profile.pug', params);
});
app.post('/profile', (req, res) => {
    console.log(req.body);
    var myData = new Profile(req.body);
    myData.save().then(() => {
            res.send("This item has been saved to database");
        }).catch(() => {
            res.send(400).send("Item was not saved to the database");
        })
        // res.status(200).render('contact.pug');
});
app.get('/registrations', (req, res) => {
    const params = {}
    res.status(200).render('registrations.pug', params);
});
app.get('//technical', (req, res) => {
    const params = {}
    res.status(200).render('technical.pug', params);
});
app.get('//non_technical', (req, res) => {
    const params = {}
    res.status(200).render('non_technical.pug', params);
});
app.get('//webinar', (req, res) => {
    const params = {}
    res.status(200).render('webinar.pug', params);
});

//Start the server
app.listen(port, () => {
    console.log(`The application started successfully on port ${port}`);
});