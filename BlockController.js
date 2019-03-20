const SHA256 = require('crypto-js/sha256');
const BlockClass = require('./Block.js');
const Blockchain = require('./Blockchain.js');


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

        this.initializeMockData();
        this.getBlockByIndex();
        this.postNewBlock();
    }

    /**
     * Implement a GET Endpoint to retrieve a block by index, url: "/api/block/:index"
     */
    getBlockByIndex() {
        this.app.get("/block/:index", (req, res) => {
            let index = req.param('index');

            this.blockchain.getBlock(index).then((result) => {
                res.send(result);
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
            if (req.body.hasOwnProperty('data')) {
                let data = req.body.data;

                let newBlock = BlockClass.Block.DataInstance(data);
                this.blockchain.addBlock(newBlock).then((result) => {
                    console.log('this.blockchain.addBlock');
                    console.log(result);
                    let stringBlock = JSON.stringify(newBlock);
                    console.log(stringBlock);
                    res.send(stringBlock);
                }).catch((err) => {
                    res.send(err.toString());
                    console.log(err.toString());
                });


            } else {
                res.send('error: data is empty');
            }
        });
    }

    /**
     * Help method to inizialized Mock dataset, adds 10 test blocks to the blocks array
     */
    initializeMockData() {
        return new Promise((resolve, reject) => {
            this.blockchain.getBlockHeight().then((result) => {
                if(result === 0){
                    (function theLoop (i) {
                        setTimeout(function () {
                            let blockTest = Block.DataInstance("Test Block - " + (i + 1));
                            this.blockchain.addBlock(blockTest).then((result) => {
                                console.log(result);
                                i++;
                                if (i < 3) theLoop(i);
                            });
                        }, 10000);
                    })(0);
                }
            });
        })
    }

}

/**
 * Exporting the BlockController class
 * @param {*} app 
 */
module.exports = (app) => { return new BlockController(app);}