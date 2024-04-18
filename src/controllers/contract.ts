import {Request, Response} from 'express';
import config from '../config/environment';

import {Contract, ContractModel} from "../schemas/contract";

const logger = require("../logger")(module);


/**
* Controller CRUD des catégories
* Create ; Update ; Delete
* @author Loïc Daniel <loicdaniel.fr>
**/

export class contractController{

	/**
	 * Constructeur
	 * @param {none}
	 * @return {ContractController}
	**/
	constructor() { }

}

export const ContractController = new contractController();