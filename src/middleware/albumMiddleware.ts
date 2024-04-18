import {Request, Response, NextFunction} from 'express';

import {Album, AlbumModel} from "../schemas/album";
import {User, UserModel} from "../schemas/user";
import {VisitorModel, Visitor} from "../schemas/visitor";
import {Vue, Hover} from "../schemas/VueHover";

const logger = require("../logger")(module);


/**
* fonctions intermédiaire permetant d'ajouter 
* des vues et des hovers sur un item à un visiteur et user
* @author Loïc Daniel <loicdaniel.fr>
**/

export class albumMiddleware{

	/**
	* @param {Request} req - reçoit tout les paramètres de la route
	* @property {string} id - identifiant de l'album
	* @param {Response} res -  envoie une réponse en cas d'erreur
	* @param {NextFunction} next - fonctiion de callback
	* @return {void}
	* **/

	async exist(req: Request, res: Response, next: NextFunction){
		try{
			let {id} = req.body;
			let album = await Album.findOne({_id:id});
			if(!album){
				logger.warn("Album not exist");
				return res.status(406).send(res.__("album not exist"));
			}
			req.body.album = album;
			next();
		}catch (error){
			logger.error(error);
			return res.status(500).send(error);
		}
	}





	/**
	* @param {Request} req - reçoit tout les paramètres de la route
	* @property {string} id - identifiant de l'album
	* @param {Response} res -  envoie une réponse en cas d'erreur
	* @param {NextFunction} next - fonctiion de callback
	* @return {void}
	* **/

	async notExist(req: Request, res: Response, next: NextFunction){
		try{
			let {id} = req.body;
			let album = await Album.findOne({_id:id});
			if(album){
				logger.warn("Album already exist");
				return res.status(406).send(res.__("album already exist"));
			}
			req.body.album = album;
			next();
		}catch (error){
			logger.error(error);
			return res.status(500).send(error);
		}
	}





	/**
	* @param {Request} req - reçoit tout les paramètres de la route
	* @property {string} id - identifiant de l'album
	* @param {Response} res -  envoie une réponse en cas d'erreur
	* @param {NextFunction} next - fonctiion de callback
	* @return {void}
	* **/

	async isOwner(req: Request, res: Response, next: NextFunction){
		try{
			let {id, album} = req.body;
			let {user} = req.session;

			if(!user){
				logger.warn("Not connected");
                return res.status(406).send(res.__("not connected"));
			}

			if(!album)
				album = await Album.findOne({_id:id});

			if(album.user != user.id){
				logger.warn("User is not owner");
				return res.status(406).send(res.__("user is not owner"));
			}
			req.body.album = album;
			next();
		}catch (error){
			logger.error(error);
			return res.status(500).send(error);
		}
	}
}

export const AlbumMiddleware = new albumMiddleware();