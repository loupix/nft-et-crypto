'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const lodash_1 = __importDefault(require("lodash"));
const all = {
    env: process.env.NODE_ENV || 'development',
    root: path_1.default.normalize(__dirname + '/../..'),
    port: process.env.PORT || 7000,
    seed: true,
    mongoSession: {
        port: 27017 // default
    },
    mongo: {
        port: 27017,
        options: {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            /*      user: "loupix",
                  pass: "lolo",
            */ 
        }
    },
    web3: {
        http: {
            address: "localhost",
            port: 8545
        },
        ws: {
            address: "localhost",
            port: 3334
        }
    },
    secrets: {
        session: process.env.SESSION_SECRET || 'secretKey'
    }
};
exports.default = lodash_1.default.merge(all, require('./' + all.env).default);
//# sourceMappingURL=index.js.map