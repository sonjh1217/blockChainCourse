/* ===== Persist data with LevelDB ===================================
|  Learn more: level: https://github.com/Level/level     |
|  =============================================================*/

let level = require('level');
const BlockClass = require('./Block.js');
// let chainDB = './chaindata';
// let db = level(chainDB);

class LevelSandbox {
    constructor(db_path) {
        this.db_path = db_path;
        this.db = level(this.db_path);
    }

    deleteLevelDBData() {
        var db = this.db;

        return new Promise(function (resolve, reject) {
            db.createKeyStream().on('data', function(data){
                console.log('key=' + data)
                db.del(data)
            }).on('error', function(err) {
                reject(err)
            }).on('close', function() {
                resolve()
            });
        })
    }

// Add data to levelDB with key/value pair
    addLevelDBData(key,value){
        var db = this.db;
        return new Promise((resolve, reject) => {
            db.put(key, value, function(err) {
                if (err) reject(err);
                else resolve(err);
            });
        })
    }

// Get data from levelDB with key
    getLevelDBData(key){
        var db = this.db;
        return new Promise((resolve, reject) => {
            db.get(key, function(err, value) {
                if (err) reject(err);
                resolve(value);
            });
        })
    }

// Add data to levelDB with value
    addDataToLevelDB(value) {
        let i = 0;
        var db = this.db;
        let self = this;

        return new Promise((resolve, reject) => {
            db.createReadStream().on('data', function(data) {
                console.log('reading Block #' + i);
                console.log('Block #' + i + "'s data: " + data);
                i++;
            }).on('error', function(err) {
                reject(err);
            }).on('close', function() {
                console.log('Add Block #' + i);
                self.addLevelDBData(i, value).then((result) => {
                    resolve(result);
                }).catch((err) => {
                    reject(err);
                });

            });
        })
    }



// Method that return the height
    getBlocksCount() {
        let count = 0;
        var db = this.db;

        return new Promise(function(resolve, reject){
            db.createReadStream().on('data', function (data) {
                count++;
            })
                .on('error', function (err) {
                    reject(err);
                })
                .on('close', function () {
                    resolve(count);
                });
        });
    }

    // get block
    getBlock(blockHeight){
        // return object as a single string
        var db = this.db;

        return new Promise((resolve, reject) => {
            db.get(blockHeight, function(err, value) {
                if (err) return reject(err);
                let blockJSON = JSON.parse(value);
                var block = new BlockClass.Block(blockJSON['height'], blockJSON['time'], blockJSON['data'], blockJSON['previousHash'], blockJSON['hash'])
                resolve(block);
            });
        })
    }

    // Get block by hash
    getBlockByHash(hash) {
        let self = this;
        let block = null;
        var db = this.db;
        return new Promise(function(resolve, reject) {
            db.createReadStream().on('data', function (data) {
                let currentBlock = JSON.parse(data.value);
                if (currentBlock.hash === hash) {
                    block = currentBlock;
                }
            }).on('error', function (err) {
                reject(err)
            }).on('close', function () {
                resolve(block);
            });
        });
    }

    getBlockByWalletAddress(address) {
        let blocks = [];
        var db = this.db;
        return new Promise(function(resolve, reject) {
            db.createReadStream().on('data', function (data) {
                let currentBlock = JSON.parse(data.value);
                if (currentBlock.body.address === address) {
                    blocks.push(currentBlock);
                }
            }).on('error', function (err) {
                reject(err)
            }).on('close', function () {
                resolve(blocks);
            });
        });
    }
}

/* ===== Testing ==============================================================|
|  - Self-invoking function to add blocks to chain                             |
|  - Learn more:                                                               |
|   https://scottiestech.info/2014/07/01/javascript-fun-looping-with-a-delay/  |
|                                                                              |
|  * 100 Milliseconds loop = 36,000 blocks per hour                            |
|     (13.89 hours for 500,000 blocks)                                         |
|    Bitcoin blockchain adds 8640 blocks per day                               |
|     ( new block every 10 minutes )                                           |
|  ===========================================================================*/


// myBlockChain = new Blockchain(false)
// (function theLoop (i) {
//     setTimeout(function () {
//         let blockTest = Block.DataInstance("Test Block - " + (i + 1));
//         myBlockChain.addBlock(blockTest).then((result) => {
//             console.log(result);
//             i++;
//             if (i < 3) theLoop(i);
//         });
//     }, 10000);
// })(0);
//
// myBlockChain.getBlockHeight().then((result) => {
//     console.log(result);
// });
//
// myBlockChain.getBlock(1).then((result) => {
//     console.log(result);
//     console.log(result.hash);
// });
//
// myBlockChain.validateBlock(1).then((result) => {
//     console.log(result);
// });
// myBlockChain.validateChain().then((result) => {
//     console.log(result);
// });

module.exports = (db_path) => {return new LevelSandbox(db_path);};