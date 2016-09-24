# requestador.js
Requestador lets you handle request problems with ease and fun!

## Installation

Deps:
- [superagent](https://github.com/visionmedia/superagent) (installed by npm)

```
npm install
npm install -g webpack-cli // in case you don't have
webpack
```

Open `demo/index.html` with a simple webserver.


## Usage

Settings:
```js
{
    // base, min amount of seconds for next try
    retryDelayBase: 5,

    // multiplier add more time with each request
    // can be a simple number, then its counted like this:
    // retryDelayBase + (REQ_ATTEMPT * retryDelayMultiplier * retryDelayBase)
    retryDelayMultiplier: 2,

    // or a function where you can count the delays yourself
    retryDelayMultiplier: function (retryDelayBase, requestAttempts) {
        return retryDelayBase + (Math.pow(requestAttempts, 2) * retryDelayBase);
    },

    // element to which the messages will be applied
    messagesWrapper: document.querySelector('#messages'),

    // custom messages for each state
    messages: {
        // you can use {{ seconds }} slot here, it will be
        // replaced by seconds left to next request attempt
        timeout: '<b>Connection error.</b> Retrying in {{ seconds }}s',
        // message displayed while trying again
        // if the connection is still down it will be shown
        // until next request does not come out
        retrying: 'Trying again...',

        // shown for several seconds and disappears
        connected: 'OK, We are back again :)'
    },

    // prints additional info to console
    debug: true
}
```

Example:

```js
'use strict';

// required
import superagent from 'superagent';
import Requestador from './requestador';

const req = new Requestador({
    retryDelayBase: 5,
    retryDelayMultiplier: 2,
    messagesWrapper: document.querySelector('#messages'),
    messages: {
        timeout: '<b>Connection error.</b> Retrying in {{ seconds }}s',
        retrying: 'Trying again...',
        connected: 'OK, We are back again :)'
    },
    debug: true
});


// Now works only as plugin for superagent
superagent
    .get('http://nonexistingsiteontheweb.com/')
    .use(req.plugin())
    .timeout(1) // just to make the error
    .end(function(err, res) {
        console.log(err ? err : 'res ');
    });

```
