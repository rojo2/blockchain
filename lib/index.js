const crypto = require("crypto");

class Block {
  static create(data) {
    return new Block(0, Date.now(), data);
  }

  static parse(value) {
    return new Block(value.index, value.timestamp, value.data, value.previousHash, value.hash);
  }

  constructor(index, timestamp, data, previousHash = null, verifyHash = null) {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    const encodedData = (new Buffer(JSON.stringify(this.data))).toString("base64");
    this._content = `${this.index}.${this.timestamp}.${encodedData}.${this.previousHash}`;
    this.hash = crypto.createHash("sha512")
      .update(this._content)
      .digest("hex");
    if (verifyHash) {
      if (this.hash !== verifyHash) {
        throw new Error("Invalid hash");
      }
    }
  }

  next(data) {
    return new Block(this.index + 1, Date.now(), data, this.hash);
  }

  toString() {
    return this._content;
  }

  toJSON() {
    return {
      index: this.index,
      timestamp: this.timestamp,
      data: this.data,
      hash: this.hash,
      previousHash: this.previousHash
    };
  }
}

class BlockChain {
  static create(initialData) {
    return new BlockChain(Block.create(initialData));
  }

  static parse(string) {
    const blockChain = new BlockChain();
    const parsedChain = JSON.parse(string, (name, value) => {
      if (!name && !Array.isArray(value)) {
        throw new Error("Invalid chain");
      }
      if (parseInt(name, 10).toString() === name) {
        return Block.parse(value);
      }
      return value;
    });
    blockChain.chain = parsedChain;
    blockChain.current = blockChain.chain[blockChain.chain.length - 1];
    blockChain.verify();
    return blockChain;
  }

  constructor(initialBlock) {
    this.chain = [initialBlock];
    this.current = initialBlock;
  }

  next(newData) {
    this.current = this.current.next(newData);
    this.chain.push(this.current);
    return this.current;
  }

  verify() {
    if (this.chain.length > 1) {
      for (let i = 1; i < this.chain.length; i++) {
        const previous = this.chain[i - 1];
        const current = this.chain[i];
        if (current.previousHash === null && i !== 0) {
          throw new Error("Broken chain");
        }
        if (current.previousHash !== previous.hash) {
          throw new Error("Broken chain");
        }
      }
    }
    if (this.chain.length > 0 && this.current !== this.chain[this.chain.length - 1]) {
      throw new Error("Wrong chain head");
    }
    return true;
  }

  toString() {
    return JSON.stringify(this);
  }

  toJSON() {
    return this.chain;
  }
}

module.exports = {
  Block,
  BlockChain
};

