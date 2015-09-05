var SlackBot = require('slackbots');
var conf = require('nconf');

conf.file({ file: 'config.json' });

// create a bot
var bot = new SlackBot({
  token: conf.get('token'),
  name: conf.get('name')
});

bot.on('message', function(data) {
  if (data.type === 'message' && data.subtype !== 'bot_message') {
    console.log(data);
  }
});
