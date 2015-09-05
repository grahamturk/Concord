var _ = require('lodash');
var SlackBot = require('slackbots');
var yelp = require('node-yelp');
var LocuClient = require('./lib/locu');
var PostmatesClient = require('./lib/postmates');
var conf = require('nconf');
conf.file({ file: 'config.json' });

var lunchTime = require('time-detect')(conf.get('lunch_time'));
var channel = conf.get('channel');
var STATE = 'SLEEP';
var cuisines = {};

var bot = new SlackBot({
  token: conf.get('token'),
  name: conf.get('name'),
});

var startWords = ["lunch", "order", "dinner", "breakfast", "brunch"];

var containsStartWord = function(message) {
    for (var word in startWords) {
        if (message.indexOf(word) >= 0) {
            return true;
        }
    }
    return false;
};

var locuClient = new LocuClient({
  api_key: conf.get('locu:api_key'),
  api_endpoint: conf.get('locu:api_endpoint')
});

var postmatesClient = new PostmatesClient({
  customer_id: conf.get('postmates:customer_id'),
  test_api_key: conf.get('postmates:test_api_key')
});

var yelpClient = yelp.createClient({
  oauth: {
    'consumer_key': conf.get('yelp:consumer_key'),
    'consumer_secret': conf.get('yelp:consumer_secret'),
    'token': conf.get('yelp:token'),
    'token_secret': conf.get('yelp:token_secret')
  }
});

function prompt() {
  bot.postMessageToChannel(channel, "What kind of food would you like today? (Eg. Chinese, Italian)? Please respond within 15 minutes.");
}

function containsStartWord(message) {
  var startWords = ["lunch", "order", "dinner", "breakfast", "brunch"];
  for (var word in startWords) {
    if (message.indexOf(word) >= 0) {
      return true;
    }
  }
  return false;
}

function loop() {
  setTimeout(function() {
    var now = new Date();

    if (STATE === 'SLEEP') {
      if (now.getHours() === lunchTime.getHours()) {
        if (now.getMinutes() === lunchTime.getMinutes()) {
          prompt();
          STATE = 'CUISINE';
        }
      }
    }

    else if (STATE === 'CUISINE') {
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
  }, 1000);}
loop();

bot.on('message', function(data) {
  if (data.type === 'message' && data.subtype !== 'bot_message' && data.channel === channel) {

    if (STATE === 'SLEEP') {
      if (containsStartWord(data.text.toLowerCase())) {
        prompt();
        STATE = 'CUISINE';
      }
    }

    if (STATE === 'CUISINE') {
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

function foodOptions(topFood) {
  var numChoices = 5;
  if (topFood.length >= 3) {
    numChoices = 2;
  }
  else if (topFood.length === 2) {
    numChoices = 3;
  }
  for (var type in topFood) {
    yelpClient.search({
      term: type, location: conf.get('location')
    }).then(function (data) {
      var restaurants = _.pluck(data.businesses, 'name');
      var results = [];
      for (var i = 0; i < numChoices; i++) {
        results[i] = restaurants[i];
      }
      bot.postMessageToChannel('lunch', results.join('\n'), {});
    });
  }
}
