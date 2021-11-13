const express = require('express');
const path = require('path');
const app = express();
const port = 8080;

//Express Specific stuff
app.use('/static', express.static('static')); //For serving static files
app.use(express.urlencoded())

//PUG SPecific stuff

app.set('view engine', 'pug'); // set template engine as pug
app.set('views', path.join(__dirname, 'views')); // set the views directory

//ENDPOINTS
app.get('/home', (req, res) => {
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
app.get('/registrations', (req, res) => {
    const params = {}
    res.status(200).render('registrations.pug', params);
});
app.get('/home/technical', (req, res) => {
    const params = {}
    res.status(200).render('technical.pug', params);
});
app.get('/home/non_technical', (req, res) => {
    const params = {}
    res.status(200).render('non_technical.pug', params);
});
app.get('/home/webinar', (req, res) => {
    const params = {}
    res.status(200).render('webinar.pug', params);
});

//Start the server
app.listen(port, () => {
    console.log(`The application started successfully on port ${port}`);
});