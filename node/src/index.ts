import { ethers } from 'ethers';

const net = require('net');
const INFURA_ID = 'c668ee6214a74e1c89726b345a5aed66';
const network = 'homestead';

const provider = ethers.getDefaultProvider(network, {
    infura: INFURA_ID,
});

net.createServer(() => {
}).listen(3000, function() {
    console.log('server start at port 3000'); //the server object listens on port 3000
    provider.on('block', (blockNumber: number) => {
        provider.getBlock(blockNumber).then((block: ethers.providers.Block) => {
            console.log(block);
        });
    });
});