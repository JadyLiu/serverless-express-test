var AWS = require('aws-sdk');
var mAccounts = require('../models/accounts');
var config = require('config');

var Auth = {};

Auth.getSupport = function(account,callback){
      switch(account.choice){
        case 'role':
          var support = new AWS.Support({region:config.Defaults.AWS.Support.Region});
          console.log("Lib/Auth | Returning Support object for Master Account using current instance role");
          callback(null,support);
        break;
        case 'keys':
          var support = new AWS.Support({accessKeyId:account.accessKey,secretAccessKey:account.accessSecret,region:config.Defaults.AWS.Support.Region});
          console.log("Lib/Auth | Returning Support object for Master Account using configured Access Keys");
          callback(null,support);
        break;
      }
}

module.exports = Auth;
