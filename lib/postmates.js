/**
 * Created by grahamturk on 9/5/15.
 * Wrapper functions for postmates-node module
 */

var Postmates = require('postmates');
var postmates;

function PostmatesClient(options) {
    this.customer_id = options.customer_id;
    this.test_api_key = options.test_api_key;

    postmates = new Postmates(this.customer_id, this.test_api_key);
}


PostmatesClient.prototype.getQuote = function(quote) {
    return postmates.quote(jsonObj, function(err, res) {
        if (err) {
            throw new Error('Could not get quote');
        }
        return res.body;
    });
};

PostmatesClient.prototype.createDelivery = function(delivery) {
    return postmates.new(delivery, function(err, res) {
        if (err) {
            throw new Error('Could not create delivery');
        }
        return res.body;
    });
};

PostmatesClient.prototype.getDelivery = function(deliveryId) {
    return postmates.get(deliveryId, function(err, res) {
        if (err) {
            throw new Error('Could not retrieve delivery');
        }
        return res.body;
    });
};

PostmatesClient.prototype.getDeliveryList = function(filter) {
    return postmates.filter(filter, function(err, res) {
        if (err) {
            throw new Error('Could not retrieve delivery list');
        }
        return res.body;
    });
};

PostmatesClient.prototype.cancelDelivery = function(deliveryId) {
    return postmates.cancel(deliveryId, function(err, res) {
        if (err) {
            throw new Error('Could not cancel delivery');
        }
        return res.body;
    });
};

module.exports = PostmatesClient;
