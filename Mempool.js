const TimeoutRequestsWindowTime = 5*60*1000;

class Mempool {
    constructor() {
        this.mempool = [];
        this.timeoutRequests = [];
    }

    addRequestValidation(walletAddress) {
        let response;
        if (this.timeoutRequests[walletAddress]) {
            response = this.mempool[walletAddress];
            let timeElapse = (new Date().getTime().toString().slice(0,-3)) - response.requestTimestamp;
            let timeLeft = (TimeoutRequestsWindowTime/1000) - timeElapse;
            response.validationWindow = timeLeft;
        } else {
            const requestTimestamp = new Date().getTime().toString().slice(0,-3);
            const message = walletAddress + ':' + requestTimestamp + ':starRegistry';

            response = {
                walletAddress: walletAddress,
                requestTimestamp: requestTimestamp,
                message: message,
                validationWindow: TimeoutRequestsWindowTime/1000
            }

            this.mempool[walletAddress] = response;

            this.timeoutRequests[walletAddress] = setTimeout(function(){
                this.removeValidationRequest(walletAddress)
            }, TimeoutRequestsWindowTime);
        }
        return response;
    }

    removeValidationRequest(walletAddress) {
        delete (this.mempool[walletAddress]);
    }
}

module.exports.Mempool = Mempool;