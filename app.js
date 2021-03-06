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

const eventregSchema = new mongoose.Schema({
    eventname: {
        type: String,
        required: true,
    },
    // name: {
    //     type: String,
    //     required: true
    // },
    // passwd: {
    //     type: String,
    //     required: true
    // },
    regno: {
        type: String,
        required: true
    },
    // phone: {
    //     type: String,
    //     required: true
    // },
    // email: {
    //     type: String,
    //     required: true
    // }
});

const eventSchema = new mongoose.Schema({
    orgname: {
        type: String
    },
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

    eventtype: {
        type: String,
        required: true
    }
});


const studentProfile = mongoose.model('studentProfile', studSchema);
const orgProfile = mongoose.model('orgProfile', orgSchema);
const eventProfile = mongoose.model('eventProfile', eventSchema);
const eventregProfile = mongoose.model('eventregProfile', eventregSchema);

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
    const params={}
    var myDatas = new studentProfile(req.body);
    myDatas.save().then(() => {
        res.status(200).render('home.pug', params);
    }).catch(() => {
        res.send(400).send("Item was not saved to the database");
    })
});

app.get('/orgprofile', (req, res) => {
    const params = {};
    res.status(200).render('organizerprofile.pug', params);
});

app.post('/orgprofile', (req, res) => {
    console.log(req.body);
    var params = {};
    var myDatao = new orgProfile(req.body);
    myDatao.save().then(() => {
        res.status(200).render('home_organizer.pug', {params:req.body.orgname});
    }).catch(() => {
        res.send(400).send("Item was not saved to the database");
    })
});

app.get('/eventcreation/:id', (req, res) => {
    var orgname = req.params.id;
    console.log(orgname);
    var params;
    res.status(200).render('createevent.pug', {orgname: orgname});
});

app.post('/eventcreation/:id', (req, res) => {
    console.log(req.body);
    var myDatae = new eventProfile(req.body);
    var orgnam = req.params.id;
    myDatae.save().then(() => {
        eventProfile.find({ orgname: orgnam}, function(err, docs) {
            if (err) {
                console.log('Hello');
                return handleError(err);
            } else {
                res.status(200).render('org_my_events.pug', { docs: docs });
            }
        });

    }).catch(() => {
        res.send(400).send("Item was not saved to the database");
    })
});
// ***** Creation END *****
app.get('/myregistrations/:id', (req, res) => {  
    eventregProfile.find({ regno: req.params.id }, function(err, docs) {
        if (err) {
            console.log('Hello');
            return handleError(err);
        } else {
            res.status(200).render('myregistrations.pug', { params: docs });
        }
    });
});

app.post('/myregistrations/:id', (req, res) => {
    console.log(req.body);
    var myDatae = new eventregProfile(req.body);
    myDatae.save().then(() => {
        eventregProfile.find({ regno: req.params.id }, function(err, docs) {
            if (err) {
                console.log('Hello');
                return handleError(err);
            } else {
                res.status(200).render('myregistrations.pug', { params: docs });
            }
        });

    }).catch((e) => {
        res.send(400).send("Item was not saved to the database");
    })
});


app.post('/eventregistrations', (req, res) => {
    console.log(req.body);
    eventregProfile.find({ $and: [{ eventname: req.body.eventname }, { regno: req.body.regno }] }, function(err, docs) {
        if (err) {
            console.log('Hello');
            return handleError(err);
        } else {
            res.status(200).render('eventregistrations.pug', { params: docs });
        }
    });
});


app.get('/studentlogin', (req, res) => {
    const params = {}
    res.status(200).render('studentlogin.pug', params);
});

app.post('/studentlogin', (req, res) => {
    console.log(req.body);
    const params = {};
    // studentProfile.find({ $and: [{ passwd: req.body.passwd }, { name: req.body.name }] }, function(err, docs) {
    //     console.log(docs);
    //     if (err) {
    //         console.log('Hello');
    //         return handleError(err);
    //     } else {
    //         res.status(200).render('home.pug', params);
    //         console.log("First function call : ", docs[0]['passwd']);
    //     }
    // });
    studentProfile.find({ name: req.body.name }, function(err, docs) {
        if (err) {
            console.log('Hello');
            return handleError(err);
        } else {
            // if (docs.)
            console.log('check');
            if (docs == []) {
                // return handleError(err);
                res.status(200).render('studentlogin.pug', params);
            } else {
                if (docs[0].passwd == req.body.passwd) {
                    res.status(200).render('home.pug', params);
                } else {
                    res.status(200).render('studentlogin.pug', params);
                }
            }
            console.log(docs);

        }
    })

});
app.get('/orglogin', (req, res) => {
    const params={};
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
            res.status(200).render('home_organizer.pug', {params:req.body.orgname});
            console.log("First function call : ", docs[0]['passwd']);
        }
    });

});

// ***** Login END *****

// ***** Event registration *****
app.get('/technical/:id', (req, res) => {
    var ans;
    eventProfile.find({ eventtype: "Technical" }, function(err, ans) {
        if (err) {
            console.log(err);
        } else {
            console.log(ans);
            res.render('technical.pug', { anst: ans, regno:req.params.id});
        }
    });

});

app.get('/non_technical/:id', (req, res) => {
    var ans;
    eventProfile.find({ eventtype: "Non-Technical" }, function(err, ans) {
        if (err) {
            console.log(err);
        } else {
            console.log(ans);
            res.render('non_technical.pug', { anst: ans, regno:req.params.id});
        }
    });

});
app.get('/webinar/:id', (req, res) => {
    var ans;
    eventProfile.find({ eventtype: "Webinar" }, function(err, ans) {
        if (err) {
            console.log(err);
        } else {
            console.log(ans);
            res.render('webinar.pug', { anst: ans, regno:req.params.id});
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

//Organization navbar
app.get('/org_event_registrations', (req, res) => {
    const params = {}
    res.status(200).render('org_event_registrations.pug', params);
});
app.get('/org_my_events/:id', (req, res) => {
    const orgnam = req.params.id;
    eventProfile.find({ orgname: orgnam}, function(err, docs) {
        if (err) {
            console.log('Hello');
            return handleError(err);
        } else {
            res.status(200).render('org_my_events.pug', { docs: docs });
        }
    });
});