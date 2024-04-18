import {Request, Response, NextFunction} from 'express';
import config from '../config/environment';
import path from 'path';

import {ContractModel, Contract} from "../schemas/contract";

const Web3 = require('web3');
const Account = require('web3-eth-accounts');
const W3Contract = require('web3-eth-contract');
const Personal = require('web3-eth-personal');

const wsAddress = "ws://" + config.web3.ws.address + ":" + config.web3.ws.port.toString();
const httpAddress = "http://" + config.web3.http.address + ":" + config.web3.http.port.toString();

const logger = require("../logger")(module);


/**
* fonctions intermédiaire permetant de créer les contrats NFT
* @author Loïc Daniel <loicdaniel.fr>
**/


export class contractMiddleware{



	/**
	* Créer le contrat
	* @param {Request} req - reçoit tout les paramètres de la route
	* @param {Response} res -  envoie une réponse en cas d'erreur
	* @param {NextFunction} next - fonctiion de callback
	* @return {void}
	**/

	async create(req: Request, res: Response, next: NextFunction){
		try{
			const contract = new W3Contract(wsAddress);

			next();
		}catch (error){
			logger.error(error);
			return res.status(500).send(error);
		}
	}

}


export const ContractMiddleware = new contractMiddleware();