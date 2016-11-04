'use strict'
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const nodemailer = require('nodemailer');
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware');
const AWS = require('aws-sdk');
const cors = require('cors');
const winston = require('winston');

const app = express();

var logger = new (winston.Logger)({
  transports: [
      new (winston.transports.Console)({'timestamp':true}),
      new (winston.transports.File)({'timestamp':true,filename:'/var/log/atcloud/atcloud.log'})
    ]
});

app.set('port', process.env.PORT || 3000)
app.set('views',path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors())
app.use(bodyParser.json())
app.use(awsServerlessExpressMiddleware.eventContext());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.render('index',{
    //stage: 'prod'
    stage: req.apiGateway.event.requestContext.stage
  });
console.log('stage is '+ stage);
});

app.get('/tech', (req, res) => {
    res.render('tech' ,{
    //stage: 'prod'
    stage: req.apiGateway.event.requestContext.stage
  });
});

app.get('/blog', (req, res) => {
    res.render('blog',{
    //stage: 'prod'
    stage: req.apiGateway.event.requestContext.stage
  });
});

app.get('/prod/textme', (req, res) => {
    res.render('textme', {
    //stage: 'prod'
    stage: req.apiGateway.event.requestContext.stage
  });
});

app.get('/aboutme', (req, res) => {
    res.render('aboutme', {
    //stage: 'prod'    
    stage: req.apiGateway.event.requestContext.stage
  });
})

app.post('/contact/send', function(req, res){
    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth:{
            user: 'jadyliu@gmail.com',
            pass: ''
        }
    })

    var mailOptions = {
        from: 'Jady Liu <jadyliu@gmail.com>',
        to: 'jadyliu@gmail.com',
        subject: 'Website Contact Form',
        text: 'You have submitted the following details.... Name: ' +req.body.name+ 'Email: ' +req.body.email+ 'Message: ' +req.body.message, 
        html: '<p>You have a submission with the following details...</p><ul><li>Name: '+req.body.name+'</li><li>Email: '+req.body.email+'</li><li>Message: '+req.body.message+'</li></ul>'
    };
    
    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            console.log(error);
            res.redirect('/');
        } else {
            console.log('Message Sent: '+info.response);
            res.redirect('/');
        }
    });
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
// app.listen(3000)
// var server = http.createServer(app)
// reload(server, app)
// server.listen(app.get('port'), function(){
//   console.log("Web server listening on port " + app.get('port'));
// });

// Export your express server so you can import it in the lambda function.
module.exports = app
