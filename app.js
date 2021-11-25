
const express = require('express');
const path = require('path');
const app = express();
const port = 8081;

const { check, validationResult} = require("express-validator/check");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Mongoose
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
mongoose.connect('mongodb://localhost/IWP', { useNewUrlParser: true, useUnifiedTopology: true });


// Define Mongoose Schema
const studSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    passwd:
    {
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

const orgSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    passwd:
    {
        type: String,
        required: true
    },
    orgtype: {
        type: String,
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

const eventSchema = new mongoose.Schema({
    eventname: {
        type: String,
        required: true,
        unique:true
    },
    eventdes:
    {
        type: String,
        required: true
    },
    regfee: {
        type: String,
        required: true
    },
    orgnam1: {
        type: String,
        required: true
    },
    orgphone1: {
        type: String,
        required: true
    },
    orgnam2: {
        type: String,
    },    
    orgphone2: {
        type: String,
    },
    eventtype: {
        type: String,
        required: true
    }
});

const studentProfile = mongoose.model('studentProfile', studSchema);
const orgProfile = mongoose.model('orgProfile', orgSchema);
const eventProfile = mongoose.model('eventProfile', eventSchema);

//Express Specific stuff
app.use('/static', express.static('static')); //For serving static files
app.use(express.urlencoded({ extended: false }))

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

app.get('/studentprofile', (req, res) => {
    const params = {}
    res.status(200).render('studentprofile.pug', params);
});
app.post('/studentprofile', (req, res) => {
    console.log(req.body);
    var myDatas = new studentProfile(req.body);
    myDatas.save().then(() => {
            res.send("This item has been saved to database");
        }).catch(() => {
            res.send(400).send("Item was not saved to the database");
        })
});

app.get('/orgprofile', (req, res) => {
    const params = {}
    res.status(200).render('organizerprofile.pug', params);
});

app.post('/orgprofile', (req, res) => {
    console.log(req.body);
    var myDatao = new orgProfile(req.body);
    myDatao.save().then(() => {
            res.send("This item has been saved to database");
        }).catch(() => {
            res.send(400).send("Item was not saved to the database");
        })
});

app.get('/eventcreation', (req, res) => {
    const params = {}
    res.status(200).render('createevent.pug', params);
});

app.post('/eventcreation', (req, res) => {
    console.log(req.body);
    var myDatae = new eventProfile(req.body);
    myDatae.save().then(() => {
            res.send("This item has been saved to database");
        }).catch(() => {
            res.send(400).send("Item was not saved to the database");
        })
});

app.get('/registrations', (req, res) => {
    const params = {}
    res.status(200).render('registrations.pug', params);
});

app.get('/studentlogin', (req, res) => {
    const params = {}
    res.status(200).render('studentlogin.pug', params);
});

app.get('/orglogin', (req, res) => {
    const params = {}
    res.status(200).render('organizerlogin.pug', params);
});

app.post('/studentlogin', (req, res) => {
    console.log(req.body);
    studentProfile.find({$and:[{ name: req.body.name},{passwd: req.body.passwd}]}, function(err, docs){
            if (err) {
                console.log('Hello');
                return handleError(err);
            }
            else {
                console.log("First function call : ", docs[0]['passwd']);
            }
        });

});

app.post('/orglogin', (req, res) => {
    console.log(req.body);
    orgProfile.find({$and:[{ name: req.body.name},{passwd: req.body.passwd}]}, function(err, docs){
            if (err) {
                console.log('Hello');
                return handleError(err);
            }
            else {
                console.log("First function call : ", docs[0]['passwd']);
            }
        });

});



app.get('//technical', (req, res) => {
    var ans;
        eventProfile.find({eventtype:"Technical" }, function(err, ans){
            if (err){
                console.log(err);
            }
            else{
                console.log(ans);
                res.render('technical.pug', {anst: ans});
            }
        });
    
});


app.get('//non_technical', (req, res) => {
    var ans;
        eventProfile.find({eventtype:"Non-Technical" }, function(err, ans){
            if (err){
                console.log(err);
            }
            else{
                console.log(ans);
                res.render('technical.pug', {anst: ans});
            }
        });
    
});
app.get('//webinar', (req, res) => {
    var ans;
        eventProfile.find({eventtype:"Webinar" }, function(err, ans){
            if (err){
                console.log(err);
            }
            else{
                console.log(ans);
                res.render('technical.pug', {anst: ans});
            }
        });
    
});

//Start the server
app.listen(port, () => {
    console.log(`The application started successfully on port ${port}`);
});