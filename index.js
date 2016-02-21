var program = require('commander');
var login = require('facebook-chat-api');
var jsdom = require('jsdom');
var $ = require('jQuery');

program
  .version('0.0.1')
  .option('-u, --username <username>', 'fb username', '')
  .option('-p, --password <password>', 'fb password', '')
  .option('-i, --id <id>', 'recipient id', '')
  .option('-j, --interval <interval>', 'send interval', 1000*60*60*24)
  .parse(process.argv);
 
var sendInterval = setInterval(function() {
    login({email: program.username, password: program.password}, function (err, api) {
        if(err) return console.error(err);
        $.get('http://catfacts-api.appspot.com/api/facts', function (data) {
            api.sendMessage({
                body: data.facts[0]
            }, parseInt(program.id), function (err, messageInfo) {
                if(err) return console.error(err);
                console.log('success - ' + messageInfo.timestamp);
            });
        });
    });
}, program.interval)