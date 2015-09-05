var SlackBot = require('slackbots');
var conf = require('nconf');
var channel;
conf.file({ file: 'config.json' });

// create a bot
var bot = new SlackBot({
  token: conf.get('token'),
  name: conf.get('name')
});

var startWords = ["lunch", "order", "dinner", "breakfast", "brunch"];

var containsStartWord = function(message) {
    for (var word in startWords) {
        if (message.indexOf(word) >= 0) {
            return true;
        }
    }
    return false;
}

// Checks if lunch was used in message, starts LunchBot.
bot.on('message', function(data) {
   if (data.type === 'message' && data.subtype !== 'bot_message') {
       var message = data.text;
       channel = data.getChannel;
    if (containsStartWord()) {
        getTypeOfFood();
    }
   }
});

function getTypeOfFood() {
    var users = bot.getUsers()._value.members;
    for (var userIndex in users) {
        var username = users[userIndex].name;
        if (username !== 'concord' && username !== 'slackbot') {
            bot.postMessageToChannel(username,
                "What kind of food would you like (Eg. Chinese, Italian)? Please respond within 15 minutes.", {});
        }
    }
    var typeOfFood = {};
    var topFood = { type: [], count: 0 };
    bot.on('message', function(data) {
       if (data.type === 'message' && data.subtype !== 'bot_message' && data.channel == channel) {
           var message = data.text.toLowerCase();
           // TODO: account for differences in strings like adding "food" to the end by removing spaces
           if (message.indexOf("food") >= 0) {
               message = message.substring(0,message.length - 5);
           }
           if (typeOfFood[message] != null) {
               typeOfFood[message]++;
               var currCount = typeOfFood[message];
               if (topFood.count < currCount) {
                   topFood.type = [message];
                   topFood.count = currCount;
               } else if (topFood.count == currCount) {
                   topFood.type[topFood.type.length + 1] = message;
               }
           } else {
               typeOfFood[message] = 1;
           }
       }
       return topFood.type;
    });
};


