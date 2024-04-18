import {Request, Response} from 'express';
import config from '../config/environment';

import {Profile, ProfileModel} from "../schemas/profile";

const logger = require("../logger")(module);



/**
* Controller CRUD des profile
* Create ; Update ; Delete
* @author Loïc Daniel <loicdaniel.fr>
**/


export class profileController{
	/**
	 * Constructeur
	 * @param {none}
	 * @return {ProfileController}
	**/
	constructor() { }



	/**
	 * Créer un nouveau profile
	 * @param {Request} req - reçoit tout les paramètres de la route
	 * @property {String} firstname
	 * @property {String} lastname
	 * @property {String} photo
	 * @property {String} gender
	 * @param {Response} res -  envoie une réponse en json
	 * @return {void}
	**/

	async create(req: Request, res: Response){
		let {user} = req.session;

	}




	/**
	 * modifie un profile
	 * limité seulement à l'utilisateur
	 * @param {Request} req - reçoit tout les paramètres de la route
	 * @property {String} firstname
	 * @property {String} lastname
	 * @property {String} photo
	 * @property {String} gender
	 * @param {Response} res -  envoie une réponse en json
	 * @return {void}
	**/

	async update(req: Request, res: Response){
		let {user} = req.session;
	}




	/**
	 * Supprime un profile
	 * limité seulement à l'utilisat
	 * @param {Request} req - reçoit tout les paramètres de la route
	 * @property {integer} id - identifiant du profile
	 * @param {Response} res -  envoie une réponse en json
	 * @return {void}
	**/

	async delete(req: Request, res: Response){
		let {user} = req.session;
	}


}


export const ProfileController = new profileController();