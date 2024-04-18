"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const environment_1 = __importDefault(require("./environment"));
const Web3 = require('web3');
const Account = require('web3-eth-accounts');
const Contract = require('web3-eth-contract');
const Personal = require('web3-eth-personal');
const wsAddress = "ws://" + environment_1.default.web3.ws.address + ":" + environment_1.default.web3.ws.port.toString();
const httpAddress = "http://" + environment_1.default.web3.http.address + ":" + environment_1.default.web3.http.port.toString();
const logger = require("./logger")(module);
let web3 = new Web3(wsAddress);
web3.eth.getAccounts().then((accounts) => {
    let account = accounts[0];
});
//# sourceMappingURL=firstContract.js.map