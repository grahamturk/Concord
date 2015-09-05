/**
 * Created by grahamturk on 9/5/15.
 * Wrapper functions for postmates-node module
 */

var Postmates = require('postmates');
var postmates;

function PostmatesProtoype(options) {
    this.customer_id = options.customer_id;
    this.test_api_key = options.test_api_key;

    postmates = new Postmates(this.customer_id, this.test_api_key);
}


function getQuote(quote) {
    postmates.quote(jsonObj, function(err, res) {
        if (err) {
            throw new Error('Could not get quote');
        }
        return res.body;
    });
}

function createDelivery(delivery) {
    postmates.new(delivery, function(err, res) {
        if (err) {
            throw new Error('Could not create delivery');
        }
        return res.body;
    });
}

function getDelivery(deliveryId) {
    postmates.get(deliveryId, function(err, res) {
        if (err) {
            throw new Error('Could not retrieve delivery');
        }
        return res.body;
    });
}

function getDeliveryList(filter) {
    postmates.filter(filter, function(err, res) {
        if (err) {
            throw new Error('Could not retrieve delivery list');
        }
        return res.body;
    });
}

function cancelDelivery(deliveryId) {
    postmates.cancel(deliveryId, function(err, res) {
        if (err) {
            throw new Error('Could not cancel delivery');
        }
        return res.body;
    });

}
