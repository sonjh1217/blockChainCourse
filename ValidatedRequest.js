class ValidatedRequest {
    constructor(walletAddress, requestTimeStamp, message, validationWindow, isValid) {
        this.registerStar = true;
        this.status = {
            address: walletAddress,
            requestTimeStamp: requestTimeStamp,
            message: message,
            validationWindow: validationWindow,
            messageSignature: isValid
        };
    }
}

module.exports.ValidatedRequest = ValidatedRequest;