"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContractMiddleware = exports.contractMiddleware = void 0;
const environment_1 = __importDefault(require("../config/environment"));
const Web3 = require('web3');
const Account = require('web3-eth-accounts');
const W3Contract = require('web3-eth-contract');
const Personal = require('web3-eth-personal');
const wsAddress = "ws://" + environment_1.default.web3.ws.address + ":" + environment_1.default.web3.ws.port.toString();
const httpAddress = "http://" + environment_1.default.web3.http.address + ":" + environment_1.default.web3.http.port.toString();
const logger = require("../logger")(module);
/**
* fonctions intermédiaire permetant de créer les contrats NFT
* @author Loïc Daniel <loicdaniel.fr>
**/
class contractMiddleware {
    /**
    * Créer le contrat
    * @param {Request} req - reçoit tout les paramètres de la route
    * @param {Response} res -  envoie une réponse en cas d'erreur
    * @param {NextFunction} next - fonctiion de callback
    * @return {void}
    **/
    async create(req, res, next) {
        try {
            const contract = new W3Contract(wsAddress);
            next();
        }
        catch (error) {
            logger.error(error);
            return res.status(500).send(error);
        }
    }
}
exports.contractMiddleware = contractMiddleware;
exports.ContractMiddleware = new contractMiddleware();
//# sourceMappingURL=contractMiddleware.js.map