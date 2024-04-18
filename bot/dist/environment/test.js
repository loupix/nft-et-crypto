'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    seed: false,
    ip: process.env.IP || undefined,
    mongoSession: {
        mongoUrl: 'mongodb://localhost/nftcrypto-bot-test',
        uri: 'mongodb://localhost/nftcrypto-bot-test',
        autoRemove: 'interval',
        autoRemoveInterval: 10,
        crypto: {
            secret: 'squirrel'
        }
    },
    mongo: {
        mongoUrl: 'mongodb://localhost/nftcrypto-bot-test',
        uri: 'mongodb://localhost/nftcrypto-bot-test'
    },
    web3: {
        http: {
            address: "node10",
            port: 8545
        },
        ws: {
            address: "node10",
            port: 8546
        }
    },
};
//# sourceMappingURL=test.js.map