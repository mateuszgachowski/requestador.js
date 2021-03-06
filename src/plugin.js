'use strict';

import timeoutError from './timeout';

export default function (request) {
    this.request = request;
    this.request._timeoutError = timeoutError.bind(this);

    return request;
}
