'use strict';

import superagent from 'superagent';
import Requestador from './requestador';

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

superagent
    .get('http://placekitten.com/100/' + (100))
    .use(req.plugin())
    .timeout(1)
    .end(function(err, res) {
        console.log(err ? err : 'res ');
    });


function test() {
    superagent
        .get('http://ttttttttttt1232132121.com/')
        .use(req.plugin())
        .timeout(1)
        .end(function(err, res) {
            console.log(err ? err : 'res ');
        });
}

setTimeout(test, 8000);
