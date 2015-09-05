/**
 * Created by grahamturk on 9/5/15.
 */

var Postmates = require('postmates');
var postmates = require('cus_KTfttjB_oGi5Ik', 'e0fceecd-0591-4490-bccd-9eaf995432df');

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
