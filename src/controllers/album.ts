import {Request, Response} from 'express';
import {CRUD} from "../crudInterface";
import config from '../config/environment';

import {User, UserModel} from "../schemas/user";
import {Visitor, VisitorModel} from "../schemas/visitor";
import {Album, AlbumModel} from "../schemas/album";
import {Category, CategoryModel} from "../schemas/category";
import {Item, ItemModel} from "../schemas/item";

import {Vue, Hover} from "../schemas/VueHover";


const logger = require("../logger")(module);

/**
* Controller CRUD des albums
* Create ; Read ; Update ; Delete
* @author Loïc Daniel <loicdaniel.fr>
**/


export class albumController implements CRUD{

	/**
	 * Constructeur
	 * @param {none}
	 * @return {AlbumController}
	**/
	constructor() { }


/*	endVue();
	addHover();
	endHover();
*/






	/**
	 * @param {Request} req - reçoit tout les paramètres de la route
	 * @property {string} title
	 * @property {CategoryModel} category
	 * @property {array<ItemModel>} items - Renvoyer par un middleware
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

			let {title, category, items} = req.body;

			if(!title || !category || !items){										// vérifie si les property existe
				logger.warn("wrong syntax");
				return res.status(401).send(res.__("wrong syntax"));
			}

			category = await Category.findOne({_id: category.id});
			if(await Album.findOne({title: title, category: category})){ 		// vérifie si l'album existe
				logger.warn("album already exists");
				return res.status(406).send(res.__("album already exist"));
			}

			let album = await new Album({title: title, category: category, items: items, user: user}).save()
			await Category.findOneAndUpdate({_id: category._id}, {$push:{albums:album}});
			
			// Sauvegarde session
			let newUser = await User.findOneAndUpdate({_id: user.id}, 
				{$push: {albums: album}}, 
				{returnOriginal: false});
			if(!newUser){
				logger.warn("Not changed");
				return res.status(406).send(res.__("not changed"));
			}

			req.session.user = newUser.toObject();

			req.session.save((err) => {
				if(err){
					logger.error(err);
					return res.status(500).json(err);
				}
				return res.status(200).json({
					album: album,
					user: newUser
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
			let album = await Album.findOne({_id: id});
			if(!album){
				logger.warn("Not find");
				return res.status(406).send(res.__("not find"));
			}


			let vue = await new Vue({visitor:visitor, album:album}).save();
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
					album: album
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
	 * @property {CategoryModel} category - si il veut changer de catégory
	 * @property {array<ItemModel>} items - liste d'item de l'album ; par middleware ?
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

			let {album, title} = req.body;

			let {category, items} = req.body;

			// vérifie le changement de catégorie
			if(category){
				category = await Category.findOne({_id: category.id});
				if(album.category !== category.id)
					await Album.findOneAndUpdate({_id: album.id}, {category: category});
			}


			// vérifie si on ajoute des items
			if(items){
				items = await Item.find({id:{$in: 
					items.map( (item) => { return item.id})}
				});
				if(items.length != album.items.length)
					await Album.findOneAndUpdate({_id: album.id}, {items: items});
			}

			// modifie le nom de l'album
			let newAlbum = await Album.findOneAndUpdate({_id:album.id}, {title:title}, {returnOriginal: false})
			if(!newAlbum){
				logger.warn("Not changed");
				return res.status(406).send(res.__("not changed"));
			}
			return res.status(200).json({album:newAlbum});


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

			let {album} = req.body;

			// supprime l'album & ses items
			await Album.deleteOne({_id:album._id});
			
			// Sauvegarde session
			let newUser = await User.findOneAndUpdate({_id: user.id}, 
				{$pull: {albums: album._id}}, 
				{returnOriginal: false});
			if(!newUser){
				logger.warn("Not changed");
				return res.status(406).send(res.__("not changed"));
			}

			req.session.user = newUser.toObject();

			req.session.save((err) => {
				if(err){
					logger.error(err);
					return res.status(500).json(err);
				}
				return res.status(200).json({
					user: newUser
				});
			});
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


class albumControllerVueHover extends albumController{


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


export const AlbumController = new albumControllerVueHover();