'use strict'
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const nodemailer = require('nodemailer');
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware');
const AWS = require('aws-sdk');
const cors = require('cors');
const winston = require('winston');

// const myAccounts = require('./models/accounts');
// const Fetcher = require('./lib/fetcher');
// const scheduler = require('./lib/scheduler');
const app = express();

var logger = new (winston.Logger)({
  transports: [
      new (winston.transports.Console)({'timestamp':true}),
      new (winston.transports.File)({'timestamp':true,filename:'/var/log/consigliere/consigliere.log'})
    ]
});
app.set('views',path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')));
app.use(awsServerlessExpressMiddleware.eventContext())

// scheduler.loadFromDatabase();

app.get('/', (req, res) => {
    res.render('index', {title: 'Welcome'});
});

app.get('/TextGreen', (req, res) => {
    res.render('textgreen');
      // myAccounts.scan({},function(err,accounts){
      //   if(!err){
      //     logger.info("View/index : Rendering index");
      //     // res.render('index',{accounts: accounts});
      //     res.sendStatus(200);
      //     res.send(req.accounts);
      //   }
      //   else {
      //     logger.error("Model/accounts : Accounts Scan operation failed "+err.toString());
      //   }
      // });

});

app.get('/about', (req, res) => {


})

app.get('/users/:userId', (req, res) => {
    const user = getUser(req.params.userId)

    if (!user) return res.status(404).json({})

    return res.json(user)
})

app.post('/users', (req, res) => {
    const user = {
        id: ++userIdCounter,
        name: req.body.name
    }
    users.push(user)
    res.status(201).json(user)
})

app.put('/users/:userId', (req, res) => {
    const user = getUser(req.params.userId)

    if (!user) return res.status(404).json({})

    user.name = req.body.name
    res.json(user)
})

app.delete('/users/:userId', (req, res) => {
    const userIndex = getUserIndex(req.params.userId)

    if(userIndex === -1) return res.status(404).json({})

    users.splice(userIndex, 1)
    res.json(users)
})

const getUser = (userId) => users.find(u => u.id === parseInt(userId))
const getUserIndex = (userId) => users.findIndex(u => u.id === parseInt(userId))

// Ephemeral in-memory data store
const users = [{
    id: 1,
    name: 'Joe'
}, {
    id: 2,
    name: 'Jane'
}]
let userIdCounter = users.length

// The aws-serverless-express library creates a server and listens on a Unix
// Domain Socket for you, so you can remove the usual call to app.listen.
app.listen(3000)
console.log('Server is running locally on port 3000 ...');

// Export your express server so you can import it in the lambda function.
module.exports = app
