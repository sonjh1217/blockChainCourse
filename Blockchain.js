/* ===== SHA256 with Crypto-js ===================================
|  Learn more: Crypto-js: https://github.com/brix/crypto-js      |
|  =============================================================*/

const SHA256 = require('crypto-js/sha256');

const DBPath = './chaindata';
const LevelSandbox = require('./LevelSandbox.js')(DBPath);


/* ===== Blockchain ===================================
|  Class with a constructor for blockchain data model  |
|  with functions to support:                          |
|     - createGenesisBlock()                           |
|     - getLatestBlock()                               |
|     - addBlock()                                     |
|     - getBlock()                                     |
|     - validateBlock()                                |
|     - validateChain()                                |
|  ====================================================*/

class Blockchain{
	constructor(isFromScratch){
	    if (isFromScratch == true) {
            // new chain array
            this.startFromScratch();
        }
	}

    startFromScratch() {
        LevelSandbox.deleteLevelDBData().then(() => {
            // add first genesis block
            this.addBlock(this.createGenesisBlock()).then( () => {
                }
            );
        });
    }

	createGenesisBlock(){
		return Block.DataInstance("First block in the chain - Genesis block");
	}

    // addBlock method
	addBlock(newBlock){
		return new Promise((resolve, reject) => {
            LevelSandbox.getBlocksCount().then((result) => {
                newBlock.height = result;
                newBlock.time = new Date().getTime().toString().slice(0,-3);

                if (result>0) {
                    this.getBlock(result-1).then((result) => {
                        // previous block hash
                        newBlock.previousHash = result.hash;
                        // SHA256 requires a string of data
                        newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();
                        LevelSandbox.addDataToLevelDB(JSON.stringify(newBlock).toString()).then((result => {
                            console.log('added Data To LevelDB');
                            resolve(result);
                        })).catch((err) => {
                            console.log(err);
                            reject(err);
                        });
                    }).catch((err) => {
                        reject(err);
                    });

                } else {
                    newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();
                    LevelSandbox.addDataToLevelDB(JSON.stringify(newBlock).toString()).then((result => {
                        resolve(result)
                    })).catch((err) => {
                        console.log(err);
                        reject(err);
                    });
                }

            }).catch((err) => {
                reject(err);
            });
        })
	}



	// Get block height
	getBlockHeight(){
        return new Promise((resolve, reject) => {
            LevelSandbox.getBlocksCount().then((result) => {
                resolve(result)
            }).catch((err) => {
                console.log(err);
                reject(err);
            })
        })
	}

	// validate block
	validateBlock(blockHeight){
		// get block object
        return new Promise((resolve, reject) => {
            this.getBlock(blockHeight).then((result) => {
                let block = result

                // get block hash
                let blockHash = block.hash;
                // remove block hash to test block integrity
                block.hash = '';
                // generate block hash
                let validBlockHash = SHA256(JSON.stringify(block)).toString();
                // Compare
                let isValid = false;
                if (blockHash===validBlockHash) {
                    isValid = true;
                } else {
                    console.log('Block #'+blockHeight+' invalid hash:\n'+blockHash+'<>'+validBlockHash);
                    isValid = false;
                }
                resolve(isValid)
            });
        })
	}

	// Validate blockchain
	validateChain(){
		let errorLog = [];
		return new Promise((resolve, reject) => {
            this.getBlockHeight().then((result) => {
                const chainLength = result;
                let validateBlockPromises = [];
                let blockPromises = [];
                for (let i = 0; i < chainLength; i++) {
                    // validate block
                    validateBlockPromises.push(this.validateBlock(i));
                    blockPromises.push(this.getBlock(i));
                }

                Promise.all(validateBlockPromises).then((results) => {
                    let isValidChain = true;
                    for (let i = 0; i < chainLength; i++) {
                        if (results[i] == false) {
                            isValidChain = false;
                            errorLog.push(i);
                        }
                    }

                    Promise.all(blockPromises).then((results) => {
                        for (let i = 0; i < chainLength - 1; i++) {
                            let blockHash = results[i].hash;
                            let previousHash = results[i + 1].previousHash;
                            if (blockHash !== previousHash) {
                                isValidChain = false;
                                errorLog.push(i);
                            }
                        }
                        resolve(isValidChain)
                    })
                }).catch((err) => {
                    console.log(err);

                    if (errorLog.length>0) {
                        console.log('Block errors = ' + errorLog.length);
                        console.log('Blocks: '+errorLog);
                    } else {
                        console.log('No errors detected');
                    }

                    reject(err);
                });
            });
        });
	}

    // get block
    getBlock(blockHeight){
	    return LevelSandbox.getBlock(blockHeight);
    }

    getBlockByHash(hash) {
	    return LevelSandbox.getBlockByHash(hash);
    }
}

module.exports.Blockchain = Blockchain;