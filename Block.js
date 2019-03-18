/* ===== Block Class ===================================
|  Class with a constructor for block data model       |
|  ====================================================*/

class Block {
    constructor(height, time, data, previousHash, hash){
        this.height = height;
        this.time = time;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = hash;
    }

    static DataInstance(data){
        return new Block('', '', data, '0x', '')
    }

}

module.exports.Block = Block;