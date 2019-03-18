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
            });
        });
    }

    /**
     * Implement a POST Endpoint to add a new Block, url: "/api/block"
     */
    postNewBlock() {
        this.app.post("/block", (req, res) => {
            // Add your code here
            if (req.query.hasOwnProperty('data')) {
                let data = req.query['data'];
                let newBlock = new BlockClass.Block(data);
                newBlock.height = this.blocks.length;
                newBlock.hash = SHA256(JSON.stringify(data)).toString();
                this.blocks.push(newBlock);
                let stringBlock = JSON.stringify(newBlock)
                res.send(stringBlock);
            }
            res.send('No data');
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