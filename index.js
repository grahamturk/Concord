var _ = require('lodash');
var SlackBot = require('slackbots');
var yelp = require('node-yelp');
var conf = require('nconf');

conf.file({ file: 'config.json' });

// create a bot
var bot = new SlackBot({
  token: conf.get('token'),
  name: conf.get('name')
});

var yelpClient = yelp.createClient({
  oauth: {
    'consumer_key': 'nWJ_14RwD8hssmHwuP6jGw',
    'consumer_secret': '3afs0cqQVD2O81_4bwXA5kK3zqM',
    'token': 'VBMxaHjIw2hRW7uhD57JTIkrhNs3va_v',
    'token_secret': 'WRteO_R52dxELoFcYetH8WG6OPM'
  }
});

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
