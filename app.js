const express = require('express');
const path = require('path');
const app = express();
const port = 8081;

const { check, validationResult } = require("express-validator/check");
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
    passwd: {
        type: String,
        required: true
    },
    regno: {
        type: String,
        unique: [true, 'That username is taken.'],
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
    passwd: {
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
        unique: true
    },
    eventdes: {
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
// Create model from schema
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
    res.status(200).render('studentlogin.pug', params);
});
app.get('/home', (req, res) => {
    const params = {}
    res.status(200).render('home.pug', params);
});
app.get('/home_organizer', (req, res) => {
    const params = {}
    res.status(200).render('home_organizer.pug', params);
});
app.get('/merch', (req, res) => {
    const params = {}
    res.status(200).render('merch.pug', params);
});




// ***** organizer side events *****
app.get('/orgNonTech', (req, res) => {
    var ans;
    eventProfile.find({ eventtype: "Non-Technical" }, function(err, ans) {
        if (err) {
            console.log(err);
        } else {
            console.log(ans);
            res.render('org_non_tech.pug', { anst: ans });
        }
    });
});
app.get('/orgTech', (req, res) => {
    var ans;
    eventProfile.find({ eventtype: "Technical" }, function(err, ans) {
        if (err) {
            console.log(err);
        } else {
            console.log(ans);
            res.render('org_tech.pug', { anst: ans });
        }
    });
});
app.get('/orgWebinars', (req, res) => {
    var ans;
    eventProfile.find({ eventtype: "Webinar" }, function(err, ans) {
        if (err) {
            console.log(err);
        } else {
            console.log(ans);
            res.render('org_Web.pug', { anst: ans });
        }
    });
});
// organizer side events (end)

// ***** Profile creation *****
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
        // res.status(200).render('orglogin.pug', params);
    }).catch(() => {
        res.send(400).send("Item was not saved to the database");
    })
});
//  ***** END *****

// ***** Event creation *****
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
// ***** Creation END *****

//  ***** Registered Events *****
app.get('/registrations', (req, res) => {
    const params = {}
    res.status(200).render('registrations.pug', params);
});
// END


// ***** Login *****

app.get('/studentlogin', (req, res) => {
    const params = {}
    res.status(200).render('studentlogin.pug', params);
});

app.post('/studentlogin', (req, res) => {
    console.log(req.body);
    const params = {}
    studentProfile.find({ $and: [{ name: req.body.name }, { passwd: req.body.passwd }] }, function(err, docs) {
        if (err) {
            console.log('Hello');
            return handleError(err);
        } else {
            res.status(200).render('home.pug', params);
            console.log("First function call : ", docs[0]['passwd']);
        }
    });

});
app.get('/orglogin', (req, res) => {
    const params = {}
    res.status(200).render('organizerlogin.pug', params);
});


app.post('/orglogin', (req, res) => {
    console.log(req.body);
    const params = {}
    orgProfile.find({ $and: [{ name: req.body.name }, { passwd: req.body.passwd }] }, function(err, docs) {
        if (err) {
            console.log('Hello');
            return handleError(err);
        } else {
            res.status(200).render('home_organizer.pug', params);
            console.log("First function call : ", docs[0]['passwd']);
        }
    });

});

// ***** Login END *****

// ***** Event registration *****
app.get('/technical', (req, res) => {
    var ans;
    eventProfile.find({ eventtype: "Technical" }, function(err, ans) {
        if (err) {
            console.log(err);
        } else {
            console.log(ans);
            res.render('technical.pug', { anst: ans });
        }
    });

});

app.get('/non_technical', (req, res) => {
    var ans;
    eventProfile.find({ eventtype: "Non-Technical" }, function(err, ans) {
        if (err) {
            console.log(err);
        } else {
            console.log(ans);
            res.render('non_technical.pug', { anst: ans });
        }
    });

});
app.get('/webinar', (req, res) => {
    var ans;
    eventProfile.find({ eventtype: "Webinar" }, function(err, ans) {
        if (err) {
            console.log(err);
        } else {
            console.log(ans);
            res.render('webinar.pug', { anst: ans });
        }
    });

});
//  ***** Registration Ends *****

// ***** Payment *****
app.get('/payment', (req, res) => {
    const params = {}
    res.status(200).render('payment.pug', params);
});
// ***** END *****


//Start the server
app.listen(port, () => {
    console.log(`The application started successfully on port ${port}`);
});