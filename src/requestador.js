'use strict';

import pluginSetup from './plugin.js';

let globalListeners = {};

class Requestador {
    constructor (options) {
        this.options = options || {};

        this._messages = {
            timeout (timeout) {
                return new Error('timeout of ' + timeout + 'ms exceeded');
            }
        };

        this._debug = options.debug || false;
        this.request = null;

        this.requestAttempts = 0;

        // User message flash
        this.flashElement = null;
    }

    info () {
        if (this._debug) {
            console.log(arguments);
        }
    }

    fireEvents (eventName) {
        if (globalListeners[eventName]) {
            const args = Array.prototype.slice.call(arguments);

            globalListeners[eventName].forEach((eventCallback) => {
                eventCallback.apply(this, args);
            });
        }
    }

    on (eventName, callback) {
        this.info(`Subscribed to ${eventName} event`);
        globalListeners[eventName] = globalListeners[eventName] || [];
        globalListeners[eventName].push(callback);
    }

    plugin (serial) {
        return pluginSetup.bind(this);
    }

    retryRequest () {
        this.requestAttempts++;
        if (!this.request) {
            throw new Error('No request to replay');
        }
        this.request.end(this.request._callback);
    }

    getRetryTime () {
        const retryDelayMultiplier = this.options.retryDelayMultiplier;

        // If someone wants to count it by itself
        if (typeof retryDelayMultiplier === 'function') {
            return retryDelayMultiplier(this.options.retryDelayBase, this.requestAttempts);
        }

        // Default way of counting delay to next request
        return this.options.retryDelayBase + (this.requestAttempts * retryDelayMultiplier * this.options.retryDelayBase);
    }

    flashUser () {
        const msgWrapper = this.options.messagesWrapper;
        const msg = this.options.messages;

        let secondsToRetry = this.getRetryTime();

        this.removeFlashElement();

        this.flashElement = document.createElement('p');
        this.flashElement.innerHTML = msg.timeout.replace('{{ seconds }}', secondsToRetry);

        msgWrapper.appendChild(this.flashElement);

        setTimeout(this.updateFlashUser.bind(this, secondsToRetry), 1000);
    }

    updateFlashUser (secondsToRetry) {
        const msgWrapper = this.options.messagesWrapper;
        const msg = this.options.messages;
        const flashElement = this.flashElement;
        const context = this;

        --secondsToRetry;

        flashElement.innerHTML = msg.timeout.replace('{{ seconds }}', secondsToRetry);

        if (secondsToRetry > 0) {
            setTimeout(context.updateFlashUser.bind(context, secondsToRetry), 1000);
        } else {
            context.retryRequest.call(context);
            flashElement.innerHTML = msg.retrying;

            this.request.on('end', function () {
                flashElement.innerHTML = msg.connected;
                setTimeout(context.removeFlashElement.bind(context), 1000);
            });
        }
    }

    removeFlashElement () {
        const msgWrapper = this.options.messagesWrapper;

        // Remove all current messages
        // This may be smarter in the future
        while (msgWrapper.firstChild) {
            msgWrapper.removeChild(msgWrapper.firstChild);
        }
    }
}

module.exports = Requestador;
