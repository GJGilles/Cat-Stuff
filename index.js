var program = require('commander');
var login = require('facebook-chat-api');
var http = require('http');

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
        http.request({host: 'www.catfacts-api.appspot.com', path: '/api/facts', method: 'GET'}, function (res) {
            res.setEncoding('utf8');
            res.on('data', function (chunk) {
                api.sendMessage({
                    body: JSON.parse(chunk).facts[0]
                }, parseInt(program.id), function (err, messageInfo) {
                    if(err) return console.error(err);
                    console.info('success - ' + messageInfo.timestamp);
                });
            });
        }).end();
    });
}, program.interval)