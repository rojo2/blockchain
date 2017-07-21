const { Block, BlockChain } = require("../lib");

describe("Blockchain", () => {
  it("should create a Blockchain", () => {
    const blockChain = BlockChain.create({ "hello": 0 });
    for (let i = 0; i < 10; i++) {
      blockChain.next({ "hello": i + 1 });
    }
    expect(blockChain).to.be.instanceOf(BlockChain);
    expect(blockChain.chain).to.have.property("length", 11);
    expect(blockChain.verify()).to.be.true;
  });

  it("should parse a previously generated Blockchain", () => {
    const blockChain = BlockChain.create({ "hello": 0 });
    for (let i = 0; i < 10; i++) {
      blockChain.next({ "hello": i + 1 });
    }
    const stringifiedBlockChain = blockChain.toString();
    const parsedBlockChain = BlockChain.parse(stringifiedBlockChain);
    expect(parsedBlockChain).to.be.deep.equal(blockChain);
  });
});
