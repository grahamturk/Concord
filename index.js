var SlackBot = require('slackbots');
var conf = require('nconf');

conf.file({ file: 'config.json' });

// create a bot
var bot = new SlackBot({
  token: conf.get('token'),
  name: conf.get('name')
});

// Checks if lunch was used in message, starts LunchBot.
bot.on('message', function(data) {
   if (data.type === 'message' && data.subtype !== 'bot_message') {
       var message = data.text;
    if (message.indexOf("lunch") >= 0 || message.indexOf("order") >= 0) {
        startLunchBot();
    }
   }
});

function startLunchBot() {
    getTypeOfFood();
};

function getTypeOfFood() {
    var users = bot.getUsers()._value.members;
    for (var userIndex in users) {
        var username = users[userIndex].name;
        if (username !== 'concord' && username !== 'slackbot') {
            bot.postMessageToUser(username,
                "What kind of food would you like? Please respond within 15 minutes.", {});
        }
    }
};


