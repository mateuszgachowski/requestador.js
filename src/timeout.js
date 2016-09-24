'use strict';

export default function () {
    const timeout = this._timeout;

    // this.fireEvents('timeout', this.retryRequest.bind(this), this.request);
    this.flashUser();
    this.request.callback(this._messages.timeout(timeout));
}
