import { Contract, ethers } from 'ethers';
import { Client } from 'pg';
import BlockDayStats from './contracts/BlockDayStats.json';

const net = require('net');
const INFURA_ID = 'c668ee6214a74e1c89726b345a5aed66';

const provider = ethers.getDefaultProvider('homestead', {
    infura: INFURA_ID,
});
const localProvider = new ethers.providers.JsonRpcProvider('http://host.docker.internal:8545');
//test address from truffle develop
const privateKey = '8c8917fb4bc2cc214482a005f4905cfdafb3a572d43596b59dfead0d4b959cf5';

const client: Client = new Client(
    process.env.DATABASE_URL,
);

net.createServer(() => {
}).listen(3000, function() {
    console.log('server start at port 3000'); //the server object listens on port 3000
    const wallet = new ethers.Wallet(privateKey, localProvider);
    createEthersContract(localProvider).then(contract => {
        const contractWithSigner: Contract = contract.connect(wallet);
        setInterval(saveBlocksOfDay, 30000, Date.now(), client, contractWithSigner);
        client.connect().then(() => {
            console.log('connected to database');

            provider.on('block', (blockNumber: number) => {
                provider.getBlock(blockNumber).then((block: ethers.providers.Block) => {
                    const queryBlock = 'INSERT INTO block (number, block_timestamp, gasUsed) VALUES ($1, $2, $3)';
                    const queryBlockValues = [block.number, new Date(block.timestamp * 1000), BigInt(block.gasUsed.toString())];
                    let queryTransaction = 'INSERT INTO block_transaction (hash, block_number) VALUES ';

                    for (let i = 0; i < block.transactions.length; i++) {
                        queryTransaction += '(\'' + block.transactions[i] + '\', ' + blockNumber + ')';
                        if (i < block.transactions.length - 1) {
                            queryTransaction += ', ';
                        }
                    }

                    client.query(queryBlock, queryBlockValues)
                        .then(() => console.log('Block number ' + block.number + ' saved'))
                        .catch(e => console.error(e.stack));
                    client.query(queryTransaction)
                        .catch(e => console.error(e.stack));
                });
            });
        });
    });
});

function saveBlocksOfDay(dayToSave: Date, sqlClient: Client, contract: Contract) {
    if (contract !== null) {
        const query = 'SELECT sum(gasUsed) as sum_gas, count(number) as total_block FROM block WHERE TO_CHAR(block_timestamp, \'DD/MM/YYYY\') = $1 GROUP BY DATE(block_timestamp)';

        let ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(dayToSave);
        let mo = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(dayToSave);
        let da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(dayToSave);
        const dayStringFormat = da + '/' + mo + '/' + ye;
        const values = [dayStringFormat];
        let nbBlocks: number = 0;
        let sumGas: number = 0;
        sqlClient.query(query, values)
            .then((res) => {
                sumGas = res.rows[0].sum_gas;
                nbBlocks = res.rows[0].total_block;
                console.log(sumGas);
                console.log(nbBlocks);
            })
            .then(() => {
                contract.addDailyStat(dayStringFormat, sumGas, nbBlocks)
                    .then(
                        (tx: any) => {
                            console.log(tx);
                        },
                        (e: any) => {
                            console.log('Unable to send the transaction', e);
                        },
                    );
            })
            .catch(e => console.error(e.stack));
    }
}

const createEthersContract = async (userProvider: ethers.providers.Provider): Promise<ethers.Contract> => {
    const network = await userProvider.getNetwork();
    const contractNetworks: { [k: number]: any } = BlockDayStats.networks;
    const contractAddress = contractNetworks[network.chainId].address;

    return new ethers.Contract(contractAddress, BlockDayStats.abi, userProvider);
};
