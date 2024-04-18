import {Request, Response} from 'express';
import {CRUD} from "../crudInterface";

import config from '../config/environment';

import {Album, AlbumModel} from "../schemas/album";
import {User, UserModel} from "../schemas/user";
import {Visitor, VisitorModel} from "../schemas/visitor";
import {Category, CategoryModel} from "../schemas/category";
import {ContractModel} from "../schemas/contract";
import {Item, ItemModel} from "../schemas/item";

import {Vue, Hover} from "../schemas/VueHover";

const logger = require("../logger")(module);


/**
* Controller CRUD des items
* Create ; Read ; Update ; Delete
* @author Loïc Daniel <loicdaniel.fr>
**/


export class itemController implements CRUD{

	/**
	 * Constructeur
	 * @param {none}
	 * @return {ItemController}
	**/
	constructor() {
		this.create = this.create.bind(this)
		this.read = this.read.bind(this)
		this.update = this.update.bind(this)
		this.delete = this.delete.bind(this)
	}







	/**
	 * @param {Request} req - reçoit tout les paramètres de la route
	 * @property {string} title
	 * @property {string} files
	 * @property {CategoryModel} category
	 * @property {AlbumModel} album
	 * @property {ContractModel} contract
	 * @param {Response} res -  envoie une réponse en json
	 * @return {void}
	**/
	async create(req: Request, res: Response){
		try{
			let {user} = req.session;
			if(!user){
				logger.warn("Not connected");
				return res.status(406).send(res.__("not connected"));
			}
			
			let {file} = req;
			let {title, category, album, contract} = req.body;
			if(!file || !title || !category || !contract || !album){
				logger.warn("wrong syntax");
				return res.status(401).send(res.__("wrong syntax"));
			}

			if(await Item.findOne({title:title})){
				logger.warn("item already exists");
				return res.status(401).send(res.__("item already exists"));
			}

			let item = await new Item({title: title, user: user, 
								category: category, contract: contract}).save();

			// modif category
			await Category.findOneAndUpdate({_id: category.id}, {$push: {items: item}});
			
			// modif album
			album = await Album.findOne({_id: album.id})
			if(album && album.items.indexOf(item._id) == -1){
				await Album.findOneAndUpdate({_id: album.id}, {$push:{items:item}});
			}


			// Sauvegarde session
			let newUser = await User.findOneAndUpdate({_id: user.id}, {$push: {items: item}}, 
				{returnOriginal: false});
			if(!newUser){
				logger.warn("Not changed");
				return res.status(406).send(res.__("not changed"));
			}
			req.session.user = newUser;
			req.session.save((err) => {
				if(err){
					logger.error(err);
					return res.status(500).json(err);
				}
				return res.status(200).json({
					item: item
				});
			});
		}catch (error) {
			logger.error(error);
	        return res.status(500).send(error);
	    }
	}







	/**
	 * @param {Request} req - reçoit tout les paramètres de la route
	 * @property {String} id
	 * @param {Response} res -  envoie une réponse en json
	 * @return {void}
	**/
	async read(req: Request, res: Response){
		try{
			let {visitor} = req.session;
			let {id} = req.body;
			let item = await Item.findOne({_id: id});
			if(!item){
				logger.warn("Not find");
				return res.status(406).send(res.__("not find"));
			}

			let vue = await new Vue({visitor:visitor, item:item, album:item.album}).save();
			let newVisitor = await Visitor.findOneAndUpdate({id:visitor._id}, {$push:{vues:vue}},
					{returnOriginal: false});

			// Save Session
			req.session.visitor = newVisitor;
			req.session.save((err) => {
				if(err){
					logger.error(err);
					return res.status(500).json(err);
				}
				return res.status(200).json({
					item: item
				});
			});

		}catch (error) {
			logger.error(error);
	        return res.status(500).send(error);
	    }
	}








	/**
	 * @param {Request} req - reçoit tout les paramètres de la route
	 * @property {integer} id
	 * @property {string} title
	 * @param {Response} res -  envoie une réponse en json
	 * @return {void}
	**/

	async update(req: Request, res: Response){
		try{
			let {user} = req.session;
			if(!user){
				logger.warn("Not connected");
				return res.status(406).send(res.__("not connected"));
			}
			
			let {id, title} = req.body;

			if(!id || !title){
				logger.warn("wrong syntax");
				return res.status(401).send(res.__("wrong syntax"));
			}

			let item = await Item.findOne({_id:id});
			if(!item){
				logger.warn("Album non exist");
				return res.status(404).send(res.__("album not exist"));
			}else if(item.user.id !== user.id){
				logger.warn("User is not owner");
				return res.status(406).send(res.__("user is not owner"));
			}

			let newItem = await Item.findOneAndUpdate({_id:id}, {title: title}, {returnOriginal: false});

			return res.status(200).json({
				item: newItem
			});

		}catch (error) {
			logger.error(error);
	        return res.status(500).send(error);
	    }
	}







	/**
	 * @param {Request} req - reçoit tout les paramètres de la route
	 * @property {integer} id
	 * @param {Response} res -  envoie une réponse en json
	 * @return {void}
	**/
	async delete(req: Request, res: Response){
		try{
			let {user} = req.session;
			if(!user){
				logger.warn("Not connected");
				return res.status(406).send(res.__("not connected"));
			}

			let {id} = req.body;
			if(!id){
				logger.warn("wrong syntax");
				return res.status(401).send(res.__("wrong syntax"));
			}

			let item = await Item.findOne({_id:id});
			if(!item){
				logger.warn("Item non exist");
				return res.status(404).send(res.__("item not exist"));
			}else if(item.user.id !== user.id){
				logger.warn("User is not owner");
				return res.status(406).send(res.__("user is not owner"));
			}

			// Supprime de la collection
			await Album.findOneAndUpdate({_id: item.collection}, {$pull: {items: item}});

			// Supprime de la category
			await Category.findOneAndUpdate({_id: item.category}, {$pull: {items: item}});

			await Item.deleteOne({_id:id});		// supprime l'item


			// Sauvegarde session
			let newUser = await User.findOneAndUpdate({_id: user.id}, {$pull: {items: item}}, 
				{returnOriginal: false});
			if(!newUser){
				logger.warn("Not changed");
				return res.status(406).send(res.__("not changed"));
			}
			req.session.user = newUser;
			req.session.save((err) => {
				if(err){
					logger.error(err);
					return res.status(500).json(err);
				}
				return res.status(200).json({
					item: item
				});
			});
			return res.status(200).send();

		}catch (error) {
			logger.error(error);
	        return res.status(500).send(error);
	    }
	}


}















/**
 * Refactoring : Prototypage
 * 
 * Ajout des fonctions 
 * sur les vues & les hovers
**/


class itemControllerVueHover extends itemController{


	constructor(){
		super();
	}






	
	/**
	 * @param {Request} req - reçoit tout les paramètres de la route
	 * @property {String} id
	 * @param {Response} res -  envoie une réponse en json
	 * @return {void}
	**/
	async addHover(req: Request, res: Response){
		try{
			let {visitor} = req.session;
			let {id} = req.body;
			let album = await Album.findOne({_id: id});
			if(!album){
				logger.warn("Not find");
				return res.status(406).send(res.__("not find"));
			}

			let hover = await new Hover({visitor:visitor, album: album}).save();
			let newVisitor = await Visitor.findOneAndUpdate({id:visitor.id}, {$push:{vues:vue}},
					{returnOriginal: false});

			// Save Session
			req.session.visitor = newVisitor;
			req.session.save((err) => {
				if(err){
					logger.error(err);
					return res.status(500).json(err);
				}
				return res.status(200);
			});
		}catch (error) {
			logger.error(error);
	        return res.status(500).send(error);
	    }
	};







	/**
	 * @param {Request} req - reçoit tout les paramètres de la route
	 * @property {String} id - identifiant de la vue
	 * @param {Response} res -  envoie une réponse en json
	 * @return {void}
	**/
	async endVue(req: Request, res: Response){
		try{
			let {visitor} = req.session;
			let {id} = req.body;
			await Vue.findOneAndUpdate({id:id}, {endDate: new Date()});
			return res.status(200);

		}catch (error) {
			logger.error(error);
	        return res.status(500).send(error);
	    }
	};










	/**
	 * @param {Request} req - reçoit tout les paramètres de la route
	 * @property {String} id
	 * @param {Response} res -  envoie une réponse en json
	 * @return {void}
	**/
	async endHover(req: Request, res: Response){
		try{
			let {visitor} = req.session;
			let {id} = req.body;
			await Hover.findOneAndUpdate({id:id}, {endDate: new Date()});
			return res.status(200);
		}catch (error) {
			logger.error(error);
	        return res.status(500).send(error);
	    }
	};
}





export const ItemController = new itemControllerVueHover();