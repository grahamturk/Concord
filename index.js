var SlackBot = require('slackbots');

// create a bot
var bot = new SlackBot({
    token: 'xoxb-10236404791-FVkvEuD7HTcfiIoDcaoa73Km',
    name: 'Concord'
});

bot.on('message', function(data) {
  if (data.type === 'message' && data.subtype !== 'bot_message') {
    console.log(data);
  }
});
