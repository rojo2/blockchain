# Blockchain

This is just an experiment, a PoC to understand how a blockchain can be created 
and how implement it using Node.js

## Creating a Blockchain

```js
const BlockChain = require("blockchain");

// populate the block chain with initial data
const blockChain = BlockChain.create({
  data: 0
});

// create new parts of the chain.
for (let i = 0; i < 1000; i++) {
  blockChain.next({
    data: i * 12
  });
}
```

## Parsing a previously created Blockchain

```js
const BlockChain = require("blockchain");
const blockChain = BlockChain.parse(fs.readFileSync("blockchain.json", "utf-8"));
```

Made with :heart: by [ROJO 2](http://rojo2.com)
