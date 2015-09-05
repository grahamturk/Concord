var _ = require('lodash');
var SlackBot = require('slackbots');
var yelp = require('node-yelp');
var conf = require('nconf');
conf.file({ file: 'config.json' });

var lunchTime = require('time-detect')(conf.get('lunch_time'));
var channel = conf.get('channel');
var STATE = 'SLEEP';
var cuisines = {};

var bot = new SlackBot({
  token: conf.get('slack_token'),
  name: conf.get('name')
});


function containsStartWord(message) {
  var startWords = ["lunch", "order", "dinner", "breakfast", "brunch"];
  for (var word in startWords) {
    if (message.indexOf(word) >= 0) {
      return true;
    }
  }
  return false;
}

var yelpClient = yelp.createClient({
  oauth: {
    'consumer_key': conf.get('yelp:consumer_key'),
    'consumer_secret': conf.get('yelp:consumer_secret'),
    'token': conf.get('yelp:token'),
    'token_secret': conf.get('yelp:token_secret')
  }
});

function loop() {
  setTimeout(function() {
    var now = new Date();

    if (STATE === 'SLEEP') {
      if (now.getHours() === lunchTime.getHours()) {
        if (now.getMinutes() === lunchTime.getMinutes()) {
          STATE = 'PROMPT';
        }
      }
    }

    else if (STATE === 'PROMPT') {
      bot.postMessageToChannel(channel, "What kind of food would you like today? (Eg. Chinese, Italian)? Please respond within 15 minutes.");
      STATE = 'RESTAURANT';
    }

    else if (STATE === 'RESTAURANT') {
      if (now.getHours() === lunchTime.getHours()) {
        if (now.getMinutes() === lunchTime.getMinutes() + 15) {
          var sorted = _.sortBy(cuisines, function(n) {
            return n;
          }, _.values);
          console.log(sorted);
        }
      }
    }

    loop();
  }, 1000);
}
loop();

bot.on('message', function(data) {
  if (data.type === 'message' && data.subtype !== 'bot_message' && data.channel === channel) {

    if (STATE === 'SLEEP') {
      if (containsStartWord(data.text.toLowerCase())) {
        STATE = 'PROMPT';
      }
    }

    if (STATE === 'RESTAURANT') {
      var message = data.text.toLowerCase();

      if (message.indexOf("food") >= 0) {
        message = message.replace('food', '');
      }

      if (cuisines[message] !== null) {
        cuisines[message]++;
        var currCount = cuisines[message];
      } else {
        cuisines[message] = 1;
      }
    }

    // if (data.text.search('food') !== -1) {
    //   var term = data.text.replace('food', '');
    //   yelpClient.search({
    //     term: term,
    //     location: 'Philadelphia'
    //   }).then(function(data) {
    //     var restaurants = _.pluck(data.businesses, 'name');
    //     bot.postMessageToChannel('lunch', restaurants.join('\n'));
    //   });
    // }
  }
});
