import {Request, Response, NextFunction} from 'express';

import {ItemModel, Item} from "../schemas/item";
import {VisitorModel, Visitor} from "../schemas/visitor";
import {Vue, Hover} from "../schemas/VueHover";

const logger = require("../logger")(module);


/**
* fonctions intermédiaire permetant d'ajouter 
* des vues et des hovers sur un item à un visiteur et user
* @author Loïc Daniel <loicdaniel.fr>
**/


export class itemMiddleware{



	/**
	* Get un item en fonction de son Id
	* @param {Request} req - reçoit tout les paramètres de la route
	* @property {string} id - identifiant de l'item
	* @param {Response} res -  envoie une réponse en cas d'erreur
	* @param {NextFunction} next - fonctiion de callback
	* @return {void}
	* **/

	async get(req: Request, res: Response, next: NextFunction){
		try{
			let {id} = req.body;
			let item = Item.findOne({_id:id});
			if(!item){
				logger.warn("Item not found");
				return res.status(404).send(res.__("item not found"));
			}
			req.body.item = item;
			next();
		}catch (error){
			logger.error(error);
			return res.status(500).send(error);
		}
	}


	
	/**
	* Ajoute une vue à un item
	* @param {Request} req - reçoit tout les paramètres de la route
	* @param {Response} res -  envoie une réponse en cas d'erreur
	* @param {NextFunction} next - fonctiion de callback
	* @return {void}
	* **/

	async addVue(req: Request, res: Response, next: NextFunction){
		try{
			let {visitor} = req.session;
			if(!visitor){
				logger.warn("Not connected");
                return res.status(406).send(res.__("not connected"));
			}
			let {item} = req.body;
			let vue = await new Vue({visitor: visitor, item: item}).save();
			await Visitor.findOneAndUpdate({_id: visitor.id}, {$push: {vues: vue}});
			next();
		}catch (error){
			logger.error(error);
			return res.status(500).send(error);
		}
	}



	/**
	* Ajoute un hover à un item
	* @param {Request} req - reçoit tout les paramètres de la route
	* @param {Response} res -  envoie une réponse en cas d'erreur
	* @param {NextFunction} next - fonctiion de callback
	* @return {void}
	* **/

	async addHover(req: Request, res: Response, next: NextFunction){
		try{
			let {visitor} = req.session;
			if(!visitor){
				logger.warn("Not connected");
                return res.status(406).send(res.__("not connected"));
			}
			let {item} = req.body;
			let hover = await new Hover({visitor: visitor, item: item}).save();
			await Visitor.findOneAndUpdate({_id: visitor.id}, {$push: {hovers: hover}});
			next();
		}catch (error){
			logger.error(error);
			return res.status(500).send(error);
		}
	}

}


export const ItemMiddleware = new itemMiddleware();