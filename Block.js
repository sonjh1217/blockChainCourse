/* ===== Block Class ===================================
|  Class with a constructor for block data model       |
|  ====================================================*/

class Block {
    constructor(height, time, body, previousHash, hash){
        this.height = height;
        this.time = time;
        this.body = body;
        this.previousHash = previousHash;
        this.hash = hash;
    }

    static DataInstance(body){
        return new Block('', '', body, '0x', '')
    }

}

module.exports.Block = Block;