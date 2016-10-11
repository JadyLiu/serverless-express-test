var Scheduler = {};
var myAccounts = require('../models/accounts');
var CronJob = require('cron').CronJob;
var Fetcher = require('./fetcher');
var config = require('config');

Scheduler.scheduleSingle = function(account){
  Fetcher.fetchStatsFor(account);
  var job = new CronJob({
    cronTime: config.Scheduler.CronPattern,
    onTick: function(){
      Fetcher.fetchStatsFor(account);
    },
    start: true
  });
}

Scheduler.loadFromDatabase = function(){
  myAccounts.scan({},function(err,accounts){
    if(!err){
      console.log("Lib/Scheduler | Accounts list retrieved successfully");
      accounts.forEach(function(account){
        console.log("Lib/Scheduler | Scheduling check for Account "+ account.accountName +"("+ account.accountNumber +")");
        Scheduler.scheduleSingle(account);
      });
    }
    else {
      console.log("Lib/Scheduler | Accounts scan operation failed");
    }
  });
}

module.exports = Scheduler;
