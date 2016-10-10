'use strict'
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')
const AWS = require('aws-sdk');
const myAccounts = require('./models/accounts');
const Fetcher = require('./lib/fetcher');
const app = express()

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(awsServerlessExpressMiddleware.eventContext())

app.get('/', (req, res) => {
    res.sendFile(`${__dirname}/views/index.html`)
})

app.get('/users', (req, res) => {
//
    var account = new myAccounts();
    if(typeof req.accountName != 'undefined')
      account.accountName = req.accountName;

    if(typeof req.accountNumber != 'undefined')
      account.accountNumber = req.accountNumber;

    if(typeof req.roleArn != 'undefined')
      account.roleArn = req.roleArn;

    if(typeof req.accessKey != 'undefined')
      account.accessKey = req.accessKey;

    if(typeof req.accessSecret != 'undefined')
      account.accessSecret = req.accessSecret;

    if(typeof req.choice != 'undefined')
      account.choice = req.choice;

    account.save(function(err){
      if(!err){
        console.log("Model/accounts : POST /api/accounts | Account "+account.accountName+"("+account.accountNumber+")"+" save operation successful");
        // scheduler.scheduleSingle(account);
        reply(account).code(201);
        console.log(account);
      }
      else {
        console.log("Model/accounts : POST /api/accounts | Account "+account.accountName+"("+account.accountNumber+")"+" save operation failed | "+err.toString());
      }
    });
//

    console.log("account details");


    Fetcher.fetchStatsFor = function(account){
      console.log("Fetch1");
      auth.getSupport(account,function(err,support){
        if(!err){
          console.log("Successfully got support object for "+account.accountName+"("+account.accountNumber+")");
          var params = {
            language: config.Defaults.AWS.Support.Language
          };
          support.describeTrustedAdvisorChecks(params, function(err, data) {
            if (err) {
              logger.error("Failed to get checks for "+account.accountName+"("+account.accountNumber+")")
              var currentDate = new Date();
              account.lastRefreshed = currentDate;
              account.lastRefreshStatus = "failed";
              account.save();
            }
            else {
              //update last refreshed
              console.log("Successfully got checks for "+account.accountName+"("+account.accountNumber+")");
              var currentDate = new Date();
              account.lastRefreshed = currentDate;
              account.lastRefreshStatus = "success";
              account.save(function(err){
                if(!err){
                  console.log("Successfully saved lastRefreshed stats for "+account.accountName+"("+account.accountNumber+")");
                  client.set(account.accountNumber+'_checks', JSON.stringify(data));
                  var checkIds = [];
                  data.checks.forEach(function(check){
                    checkIds.push(check.id);
                    var params = {
                      checkId:check.id,
                      language:config.Defaults.AWS.Support.Language
                    };
                    support.describeTrustedAdvisorCheckResult(params, function(err, data) {
                      if (err) {
                        logger.error("Failed to get check results ("+check.id+") for "+account.accountName+"("+account.accountNumber+")");
                      }
                      else {
                        console.log("Successfully retrieved check results ("+check.id+") for "+account.accountName+"("+account.accountNumber+")");
                        client.set(account.accountNumber+'_result_'+check.id,JSON.stringify(data));
                      }
                    });
                  });
                  var params = {
                    checkIds : checkIds
                  };
                  support.describeTrustedAdvisorCheckSummaries(params, function(err, data) {
                    if (err){
                      console.log("Failed to get check summaries for "+account.accountName+"("+account.accountNumber+")");
                    }
                    else {
                      console.log("Successfully retrieved check summaries for "+account.accountName+"("+account.accountNumber+")");
                      client.set(account.accountNumber+'_summaries', JSON.stringify(data));
                    }
                  });
                }
                else {
                  logger.error("Failed to save lastRefreshed stats for "+account.accountName+"("+account.accountNumber+")")
                }
              });

            }
          });
        }
        else {
          //failed to get auth object
          logger.error("Failed to get support object for "+account.accountName+"("+account.accountNumber+")");
          var currentDate = new Date();
          account.lastRefreshed = currentDate;
          account.lastRefreshStatus = "failed";
          account.save();
        }
      });
    }
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

// Export your express server so you can import it in the lambda function.
module.exports = app
