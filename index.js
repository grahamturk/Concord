var _ = require('lodash');
var SlackBot = require('slackbots');
var yelp = require('node-yelp');
var conf = require('nconf');

conf.file({ file: 'config.json' });

var lunchTime = require('time-detect')(conf.get('lunch_time'));
var STATE = 'SLEEP';

var bot = new SlackBot({
  token: conf.get('slack_token'),
  name: conf.get('name')
});

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
    if (STATE === 'SLEEP') {
      var date = new Date();
      if (date.getHours() === lunchTime.getHours()) {
        if (date.getMinutes() === lunchTime.getMinutes()) {
          STATE = 'PROMPT';
        }
      }
    }

    else if (STATE === 'PROMPT') {
      bot.postMessageToChannel('lunch', 'Ready for lunch?');
      STATE = 'WAITING';
    }

    loop();
  }, 1000);
}
loop();

bot.on('message', function(data) {
  if (data.type === 'message' && data.subtype !== 'bot_message') {
    if (data.text.search('food') !== -1) {
      var term = data.text.replace('food', '');
      yelpClient.search({
        term: term,
        location: 'Philadelphia'
      }).then(function(data) {
        var restaurants = _.pluck(data.businesses, 'name');
        bot.postMessageToChannel('lunch', restaurants.join('\n'));
      });
    }
  }
});
