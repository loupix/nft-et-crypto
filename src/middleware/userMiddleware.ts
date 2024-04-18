import {Request, Response, NextFunction} from 'express';
import { v4 as uuidv4 } from 'uuid';

import {VisitorModel, Visitor} from "../schemas/visitor";
import {UserModel, User} from "../schemas/user";

const logger = require("../logger")(module);

/**
* fonctions intermédiaire permetant de voir 
* si un utilisateur est connecté
* si il est admin ou simple user
* @author Loïc Daniel <loicdaniel.fr>
**/

export class userMiddleware{
	

	/**
	* Créer un visiteur unique
	* @param {Request} req - reçoit tout les paramètres de la route
	* @param {Response} res -  envoie une réponse en cas d'erreur
	* @param {NextFunction} next - fonctiion de callback
	* @return {void}
	* **/

	async createVisitor(req: Request, res: Response, next: NextFunction){
		try{
			let {visitor} = req.session;
			let newVisitor: VisitorModel;



			// Get User Agent
			let userAgentIs = (useragent) => {
	            let r: string[] = [];
	            for (let i in useragent) 
	                if (useragent[i] === true)
	                    r.push(i);
	            return r;
	        }

			let userAgent = {
				browser: req.useragent?.browser,
				version: req.useragent?.version,
				os: req.useragent?.os,
				platform: req.useragent?.platform,
/*				geoIp: req.useragent?.geoIp, 	// needs support from nginx proxy
*/	            source: req.useragent?.source,
	            is: userAgentIs(req.useragent),
			}


			
			if(!visitor){
				var ip = require("ip");
				visitor = await Visitor.findOne({addresseIp: ip.address()}) as VisitorModel;
				if(!visitor)
					newVisitor = await new Visitor({userAgent: userAgent}).save();
				else
					newVisitor = await Visitor.findOneAndUpdate({_id:visitor.id}, {userAgent: userAgent}, 
						{returnOriginal: false}) as VisitorModel;
			}else{
				newVisitor = await Visitor.findOneAndUpdate({_id:visitor.id}, {userAgent: userAgent}, 
					{returnOriginal: false}) as VisitorModel;
			}
			req.session.visitor = newVisitor;
			req.session.save((err) => {
				if(err){
	        		logger.error(err);
	        		return res.status(500).json(err);
	         	}
	         	next();
	         });
		}catch (error){
			logger.error(error);
			return res.status(500).send(error);
		}
	}




	/**
	* Regarde si l'utilisateur est connecté
	* @param {Request} req - reçoit tout les paramètres de la route
	* @param {Response} res -  envoie une réponse en cas d'erreur
	* @param {NextFunction} next - fonctiion de callback
	* @return {void}
	* **/

	async connected(req: Request, res: Response, next: NextFunction){
		try{
			let {user} = req.session;
			if(!user){
				logger.warn("Not connected");
				return res.status(406).send(res.__("not connected"));
			}
			next();
		}catch (error){
			logger.error(error);
			return res.status(500).send(error);
		}
	}




	/**
	* Regarde si l'utilisateur n'est pas connecté
	* @param {Request} req - reçoit tout les paramètres de la route
	* @param {Response} res -  envoie une réponse en cas d'erreur
	* @param {NextFunction} next - fonctiion de callback
	* @return {void}
	* **/

	async notConnected(req: Request, res: Response, next: NextFunction){
		try{
			let {user} = req.session;
			if(user){
				logger.warn("Already connected");
				return res.status(406).send(res.__("already connected"));
			}
			next();
		}catch (error){
			logger.error(error);
			return res.status(500).send(error);
		}
	}





	/**
	* Vérifie si l'utilisateur n'éxiste pas
	* @param {Request} req - reçoit tout les paramètres de la route
	* @param {Response} res -  envoie une réponse en cas d'erreur
	* @param {NextFunction} next - fonctiion de callback
	* @return {void}
	* **/

	async notExist(req: Request, res: Response, next: NextFunction){
		try{
			let {account, email} = req.body;
			if(!isNaN(account)){
				if(await User.findOne({account:account})){
					logger.warn("notExist - Account - User already exist");
					res.status(409).send(res.__("user already exist"));
				}
				next();
			}else if(!isNaN(email)){
				if(await User.findOne({email:email})){
					logger.warn("notExist - Email - User already exist");
					res.status(409).send(res.__("user already exist"));
				}
				next();
			}else {
				logger.warn("notExist - Wrong syntax");
				res.status(409).send(res.__("wrong syntax"));
			}
			
		}catch (error){
			logger.error(error);
			return res.status(500).send(error);
		}
	}







	/**
	* Vérifie si l'utilisateur éxiste
	* @param {Request} req - reçoit tout les paramètres de la route
	* @param {Response} res -  envoie une réponse en cas d'erreur
	* @param {NextFunction} next - fonctiion de callback
	* @return {void}
	* **/

	async exist(req: Request, res: Response, next: NextFunction){
		try{
			if(req.body.account){
				let {account} = req.body;
				if(!await User.findOne({account:account})){
					logger.warn("exist - Account - User not exist");
					res.status(409).send(res.__("user not exist"));
				}
				next();
			}else if(req.body.email){
				let {email} = req.body;
				if(!await User.findOne({email:email})){
					logger.warn("exist - Email - User not exist");
					res.status(409).send(res.__("user not exist"));
				}
				next()
			}else{
				logger.warn("exist - Wrong syntax");
				res.status(409).send(res.__("wrong syntax"));
			}
		}catch (error){
			logger.error(error);
			return res.status(500).send(error);
		}
	}







	/**
	* Regarde si l'utilisateur n'est pas connecté
	* @param {Request} req - reçoit tout les paramètres de la route
	* @param {Response} res -  envoie une réponse en cas d'erreur
	* @param {NextFunction} next - fonctiion de callback
	* @return {void}
	* **/

	async disconnect(req: Request, res: Response, next: NextFunction){
		try{
			delete req.session.user;
			delete req.session.visitor;
			req.session.save((error) => {
				if(error){
					logger.error(error);
					return res.status(500).send(error);
				}
				next();
			});
		}catch (error){
			logger.error(error);
			return res.status(500).send(error);
		}
	}







	/**
	 * regarde si l'utilisateur est admin
	* @param {Request} req - reçoit tout les paramètres de la route
	* @param {Response} res -  envoie une réponse en cas d'erre
	* @param {NextFunction} next - fonctiion de callback
	* @return {void}
	* **/

	async isAdmin(req: Request, res: Response, next: NextFunction){
		try{
			let {user} = req.session;
			if(!user){
				logger.warn("Not connected");
				return res.status(401).send(res.__("not connected"));
			}
			if(!user.options.admin){
				logger.warn("User is ot admin");
				return res.status(401).send(res.__("user is not admin"));
			}
			next();
		}catch (error){
			logger.error(error);
			return res.status(500).json(error);
		}
	}





	/**
	 * regarde si l'utilisateur est bannis
	* @param {Request} req - reçoit tout les paramètres de la route
	* @param {Response} res -  envoie une réponse en cas d'erre
	* @param {NextFunction} next - fonctiion de callback
	* @return {void}
	* **/

	async isNotBanned(req: Request, res: Response, next: NextFunction){
		try{
			let {user} = req.session;
			if(!user){
				logger.warn("Not connected");
				return res.status(401).send(res.__("not connected"));
			}
			if(user.options.banned){
				logger.warn("User is banned");
				return res.status(401).send(res.__("user is banned"));
			}
			next();
		}catch (error){
			logger.error(error);
			return res.status(500).json(error);
		}
	}






	/**
	 * regarde si l'utilisateur est verifié
	* @param {Request} req - reçoit tout les paramètres de la route
	* @param {Response} res -  envoie une réponse en cas d'erre
	* @param {NextFunction} next - fonctiion de callback
	* @return {void}
	* **/

	async isVerified(req: Request, res: Response, next: NextFunction){
		try{
			let {user} = req.session;
			if(!user){
				logger.warn("Not connected");
				return res.status(401).send(res.__("not connected"));
			}
			if(!user.mail.verified){
				logger.warn("User not verified");
				return res.status(401).send(res.__("user is not verified"));
			}
			next();
		}catch (error){
			logger.error(error);
			return res.status(500).json(error);
		}
	}






	/**
	 * regarde si l'utilisateur est validée
	* @param {Request} req - reçoit tout les paramètres de la route
	* @param {Response} res -  envoie une réponse en cas d'erre
	* @param {NextFunction} next - fonctiion de callback
	* @return {void}
	* **/

	async isValidated(req: Request, res: Response, next: NextFunction){
		try{
			let {user} = req.session;
			if(!user){
				logger.warn("Not connected");
				return res.status(401).send(res.__("not connected"));
			}
			if(!user.options.verified){
				logger.warn("User not validated");
				return res.status(401).send(res.__("user is not validated"));
			}
			next();
		}catch (error){
			logger.error(error);
			return res.status(500).json(error);
		}
	}









	/**
	 * Vérifie si l'email est correct
	* @param {Request} req - reçoit tout les paramètres de la route
	* @param {Response} res -  envoie une réponse en cas d'erre
	* @param {NextFunction} next - fonctiion de callback
	* @return {void}
	* **/

	checkEmail(req: Request, res: Response, next: NextFunction){
		let {email} = req.body;

		var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

		let checked = String(email)
		    .toLowerCase()
		    .match(mailformat);
		if(!checked){
			logger.warn("Wrond email format");
			return res.status(406).send(res.__("wrong email format"));
		}
		next();
	}
}


export const UserMiddleware = new userMiddleware();