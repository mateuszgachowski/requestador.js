'use strict';

import superagent from 'superagent';
import superagentUse from 'superagent-use';
import Requestador from './requestador';

const request = superagentUse(superagent);

const req = new Requestador({
    retryDelayBase: 5,
    // retryDelayMultiplier: 2, // or a function...
    retryDelayMultiplier: function (retryDelayBase, requestAttempts) {
        return retryDelayBase + (Math.pow(requestAttempts, 2) * retryDelayBase);
    },
    messagesWrapper: document.querySelector('#messages'),
    messages: {
        timeout: '<b>Connection error.</b> Retrying in {{ seconds }}s',
        retrying: 'Trying again...',
        connected: 'OK, We are back again :)'
    },
    debug: true
});

// Use the plugin globally for all requests
request.use(req.plugin());

request
    .get('http://demo0636020.mockable.io/test')
    .timeout(1)
    .end(function(err, res) {
        console.log(err ? err : 'res ');
    });
