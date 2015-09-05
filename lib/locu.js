/**
 * Created by grahamturk on 9/5/15.
 */

var request = require('superagent');

function LocuClient(options) {
    this.api_key = options.api_key;
    this.api_endpoint = options.api_endpoint
}

LocuClient.prototype.searchVenue = function(venueQuery) {
    var jsonObj = {
        "api_key": this.api_key,
        "fields": [ "name", "location", "website_url", "menus", "menu_items", "menu_url",
                    "contact", "delivery" ],
        "limit": 1,
        "venue_queries": venueQuery
    };

    return request
                .post(this.api_endpoint)
                .type('application/json')
                .accept('json')
                .send(jsonObj)
                .end(function(err, res) {
                    if (err || res.body.error || res.body.status === 'error') {
                        throw new Error(res.body.error);
                    }
                    return res.body.venues;
                });
};

module.exports = LocuClient;
