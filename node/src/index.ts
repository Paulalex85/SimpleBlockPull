import { ethers } from 'ethers';
import { Client } from 'pg';

const net = require('net');
const INFURA_ID = 'c668ee6214a74e1c89726b345a5aed66';
const network = 'homestead';

const provider = ethers.getDefaultProvider(network, {
    infura: INFURA_ID,
});

const client: Client = new Client(
    process.env.DATABASE_URL,
);

net.createServer(() => {
}).listen(3000, function() {
    console.log('server start at port 3000'); //the server object listens on port 3000
    client.connect().then(() => {
        console.log('connected to database');

        provider.on('block', (blockNumber: number) => {
            provider.getBlock(blockNumber).then((block: ethers.providers.Block) => {
                const queryBlock = 'INSERT INTO block (number, block_timestamp, gasUsed) VALUES ($1, $2, $3)';
                const queryBlockValues = [block.number, new Date(block.timestamp), BigInt(block.gasUsed.toString())];
                let queryTransaction = 'INSERT INTO block_transaction (hash, block_number) VALUES ';

                for (let i = 0; i < block.transactions.length; i++) {
                    queryTransaction += '(\'' + block.transactions[i] + '\', ' + blockNumber + ')';
                    if (i < block.transactions.length - 1) {
                        queryTransaction += ', ';
                    }
                }

                client.query(queryBlock, queryBlockValues)
                    .then(() => client.query(queryTransaction))
                    .then(() => console.log('Block number ' + block.number + ' saved'))
                    .catch(e => console.error(e.stack));
            });
        });
    });
});