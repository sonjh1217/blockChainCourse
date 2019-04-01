const TimeoutRequestsWindowTime = 5*60*1000;

class Mempool {
    constructor() {
        this.mempool = [];
        this.timeoutRequests = [];
    }

    addRequestValidation(walletAddress) {
        let response;
        if (this.mempool[walletAddress]) {
            response = this.mempool[walletAddress];
            let timeElapse = (new Date().getTime().toString().slice(0,-3)) - response.requestTimeStamp;
            let timeLeft = (TimeoutRequestsWindowTime/1000) - timeElapse;
            response.validationWindow = timeLeft;
        } else {
            const requestTimeStamp = new Date().getTime().toString().slice(0,-3);
            const message = walletAddress + ':' + requestTimeStamp + ':starRegistry';

            response = {
                walletAddress: walletAddress,
                requestTimeStamp: requestTimeStamp,
                message: message,
                validationWindow: TimeoutRequestsWindowTime/1000
            }

            this.mempool[walletAddress] = response;

            let self = this;
            this.timeoutRequests[walletAddress] = setTimeout(function(){
                self.removeValidationRequest(walletAddress);
            }, TimeoutRequestsWindowTime);
        }
        return response;
    }

    removeValidationRequest(walletAddress) {
        delete (this.mempool[walletAddress]);
        delete (this.timeoutRequests[walletAddress]);
    }
}

module.exports.Mempool = Mempool;