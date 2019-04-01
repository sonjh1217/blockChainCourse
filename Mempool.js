const bitcoinMessage = require('bitcoinjs-message');
const ValidatedRequest = require('./ValidatedRequest');
const TimeoutRequestsWindowTime = 5*60*1000;

class Mempool {
    constructor() {
        this.mempool = [];
        this.timeoutRequests = [];
        this.mempoolValid = [];
    }

    getValidationWindow(requestTimeStamp) {
        let timeElapse = (new Date().getTime().toString().slice(0,-3)) - requestTimeStamp;
        let timeLeft = (TimeoutRequestsWindowTime/1000) - timeElapse;
        return timeLeft;
    }

    addRequestValidation(walletAddress) {
        let response;
        if (this.mempool[walletAddress]) {
            response = this.mempool[walletAddress];
            const validationWindow = this.getValidationWindow(response.requestTimeStamp);
            response.validationWindow = validationWindow;
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

    validateRequestByWallet(walletAddress, signature) {
        let request = this.mempool[walletAddress];

        if (request) {
            request.validationWindow = this.getValidationWindow(request.requestTimeStamp);

            let isValid = bitcoinMessage.verify(request.message, walletAddress, signature);
            const validatedRequest = new ValidatedRequest.ValidatedRequest(walletAddress, request.requestTimeStamp, request.message, request.validationWindow, isValid);
            delete (this.timeoutRequests[walletAddress]);
            this.mempoolValid[walletAddress] = validatedRequest;
            return validatedRequest
        } else {
            return 'Validation window is expired.';
        }
    }
}

module.exports.Mempool = Mempool;