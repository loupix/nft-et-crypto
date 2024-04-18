"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Web3Middleware = exports.web3Middleware = void 0;
const environment_1 = __importDefault(require("../config/environment"));
const Web3 = require('web3');
const Account = require('web3-eth-accounts');
const Contract = require('web3-eth-contract');
const Personal = require('web3-eth-personal');
const wsAddress = "ws://" + environment_1.default.web3.ws.address + ":" + environment_1.default.web3.ws.port.toString();
const httpAddress = "http://" + environment_1.default.web3.http.address + ":" + environment_1.default.web3.http.port.toString();
const logger = require("../logger")(module);
/**
* fonctions intermédiaire liée à la blockchain
* permettant de créer des comptes ou de les vérifier
* @author Loïc Daniel <loicdaniel.fr>
**/
class web3Middleware {
    /**
    * Créer un compte donnant une adresse Hexa
    * @param {Request} req - reçoit tout les paramètres de la route
    * @param {Response} res -  envoie une réponse en cas d'erreur
    * @param {NextFunction} next - fonctiion de callback
    * @return {void}
    * **/
    async createAccount(req, res, next) {
        try {
            let { password } = req.body;
            const personal = new Personal(wsAddress);
            personal.newAccount(password, function (err, account) {
                if (err) {
                    logger.error(err);
                    res.status(500).send(err);
                }
                req.body.account = account;
                next();
            });
        }
        catch (error) {
            logger.error(error);
            return res.status(500).send(error);
        }
    }
    /**
    * Vérifie si le compte éxiste
    * @param {Request} req - reçoit tout les paramètres de la route
    * @param {Response} res -  envoie une réponse en cas d'erreur
    * @param {NextFunction} next - fonctiion de callback
    * @return {void}
    * **/
    async checkAccount(req, res, next) {
        try {
            let { account } = req.body;
            if (isNaN(account)) {
                logger.warn("checkAccount - Wrong syntax");
                res.status(409).send(res.__("wrong syntax"));
            }
            const web3 = new Web3(wsAddress);
            if (!web3.utils.isAddress(account)) {
                logger.warn("checkAccount - Wrong syntax");
                res.status(409).send(res.__("wrong syntax"));
            }
            next();
        }
        catch (error) {
            logger.error(error);
            return res.status(500).send(error);
        }
    }
    /**
    * Créer une wallet
    * @param {Request} req - reçoit tout les paramètres de la route
    * @param {Response} res -  envoie une réponse en cas d'erreur
    * @param {NextFunction} next - fonctiion de callback
    * @return {void}
    * **/
    async createWallet(req, res, next) {
        try {
            let { user } = req.session;
            const account = new Account(wsAddress);
            if (!user) {
                logger.warn("Not connected");
                return res.status(406).send(res.__("not connected"));
            }
            let wallet = account.wallet.create(user.account);
            req.body.wallet = wallet;
            next();
        }
        catch (error) {
            logger.error(error);
            return res.status(500).send(error);
        }
    }
    /**
    * Supprime une wallet
    * @param {Request} req - reçoit tout les paramètres de la route
    * @param {Response} res -  envoie une réponse en cas d'erreur
    * @param {NextFunction} next - fonctiion de callback
    * @return {void}
    * **/
    async removeWallet(req, res, next) {
        try {
            let { user } = req.session;
            const account = new Account(wsAddress);
            if (!user) {
                logger.warn("Not connected");
                return res.status(406).send(res.__("not connected"));
            }
            let wallet = account.wallet.remove(user.account);
            next();
        }
        catch (error) {
            logger.error(error);
            return res.status(500).send(error);
        }
    }
}
exports.web3Middleware = web3Middleware;
exports.Web3Middleware = new web3Middleware();
//# sourceMappingURL=web3Middleware.js.map