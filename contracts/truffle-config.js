const path = require("path");
require('dotenv').config()

module.exports = {
    // See <http://truffleframework.com/docs/advanced/configuration>
    // to customize your Truffle configuration!
    contracts_build_directory: path.join(__dirname, "../node/contracts"),
    networks: {
        develop: {
            host: "127.0.0.1",
            port: 8545,
            network_id: "1337",
            accounts: 5,
        }
    },
    compilers: {
        solc: {
            version: "0.8.9",
            settings: {
                optimizer: {
                    enabled: true,
                    runs: 10   // Optimize for how many times you intend to run the code
                }
            }
        }
    },
};
