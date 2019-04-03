const SHA256 = require('crypto-js/sha256');
const BlockClass = require('./Block.js');
const Blockchain = require('./Blockchain.js');
const Mempool = require('./Mempool');
const hex2ascii = require('hex2ascii');

/**
 * Controller Definition to encapsulate routes to work with blocks
 */
class BlockController {

    /**
     * Constructor to create a new BlockController, you need to initialize here all your endpoints
     * @param {*} app 
     */
    constructor(app) {
        this.app = app;

        this.blockchain = new Blockchain.Blockchain(false);
        this.mempool = new Mempool.Mempool();

        this.getBlockByHeight();
        this.postNewBlock();
        this.requestValidation();
        this.validateRequestByWallet();
        this.getBlockByHash();
        this.getBlockByWalletAddress();
    }

    /**
     * Implement a GET Endpoint to retrieve a block by index, url: "/api/block/:index"
     */
    getBlockByHeight() {
        this.app.get("/block/:height", (req, res) => {
            let height = req.param('height');

            this.blockchain.getBlock(height).then((result) => {
                if (!result) {
                    res.status(404).send('No Block is found')
                } else {
                    let storyDecoded = hex2ascii(result.body.star.story);
                    result.body.star.storyDecoded = storyDecoded;
                    res.status(200).send(result);
                }
            }).catch((err) => {
                res.send(err);
            });
        });
    }

    /**
     * Implement a POST Endpoint to add a new Block, url: "/api/block"
     */
    postNewBlock() {
        this.app.post("/block", (req, res) => {
            // Add your code here
            if (req.body) {
                let body = req.body;
                let starStory = body.star.story;
                body.star.story = Buffer.from(starStory).toString('hex');
                if (!this.mempool.verifyAddressRequest(body.address)) {
                    res.status(400).send()
                } else {
                    let newBlock = BlockClass.Block.DataInstance(body);
                    this.blockchain.addBlock(newBlock).then((result) => {
                        delete(this.mempool.mempoolValid[body.address]);

                        console.log('this.blockchain.addBlock');
                        console.log(result);
                        let stringBlock = JSON.stringify(newBlock);
                        console.log(stringBlock);
                        res.send(stringBlock);
                    }).catch((err) => {
                        res.send(err.toString());
                        console.log(err.toString());
                    });
                }
            } else {
                res.send('error: data is empty');
            }
        });
    }

    requestValidation() {
        this.app.post("/requestValidation", (req, res) => {
            const walletAddress = req.body.address;
            const response = this.mempool.addRequestValidation(walletAddress);
            res.status(200).send(response);
        });
    }

    validateRequestByWallet() {
        this.app.post('/message-signature/validate', (req, res) => {
            const walletAddress = req.body.address;
            const signature = req.body.signature;
            const response = this.mempool.validateRequestByWallet(walletAddress, signature);
            res.status(200).send(response)
        });
    }

    getBlockByHash() {
        this.app.get('/stars/hash/:starHash', (req, res) => {
            let hash = req.params.starHash;
            this.blockchain.getBlockByHash(hash).then((result) => {
                if (!result) {
                    res.status(404).send('No Block is found')
                } else {
                    let storyDecoded = hex2ascii(result.body.star.story);
                    result.body.star.storyDecoded = storyDecoded;
                    res.status(200).send(result);
                }
            }).catch(err => {
                res.send(err.toString());
            });
        });
    }

    getBlockByWalletAddress() {
        this.app.get('/stars/address/:address', (req, res) => {
            let address = req.params.address;
            this.blockchain.getBlockByWalletAddress(address).then((blocks) => {
                blocks = blocks.map(block => {
                    let storyDecoded = hex2ascii(block.body.star.story);
                    block.body.star.storyDecoded = storyDecoded;
                    return block;
                })
                res.status(200).send(blocks);
            }).catch(err => {
                res.send(err.toString());
            });
        });
    }
}

/**
 * Exporting the BlockController class
 * @param {*} app 
 */
module.exports = (app) => { return new BlockController(app);}