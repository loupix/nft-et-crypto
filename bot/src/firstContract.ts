import config from './environment';
import path from 'path';

const Web3 = require('web3');
const Account = require('web3-eth-accounts');
const Contract = require('web3-eth-contract');
const Personal = require('web3-eth-personal');

const wsAddress = "ws://" + config.web3.ws.address + ":" + config.web3.ws.port.toString();
const httpAddress = "http://" + config.web3.http.address + ":" + config.web3.http.port.toString();

const logger = require("./logger")(module);

let web3 = new Web3(wsAddress);
web3.eth.getAccounts().then( (accounts) => {
	let account = accounts[0];
	
});
