import {Request, Response} from 'express';
import config from '../config/environment';

import {Category, CategoryModel} from "../schemas/category";

const logger = require("../logger")(module);



/**
* Controller CRUD des catégories
* Create ; Read ; Update ; Delete
* @author Loïc Daniel <loicdaniel.fr>
**/

export class categoryController{

	/**
	 * Constructeur
	 * Seulement en admin
	 * A utiliser avec UserMiddleware - isAdmin
	 * @param {none}
	 * @return {CategoryController}
	**/
	constructor() { 
		this.create = this.create.bind(this)
		this.update = this.update.bind(this)
		this.delete = this.delete.bind(this)
	}




	/**
	 * @param {Request} req - reçoit tout les paramètres de la route
	 * @property {string} name
	 * @property {CategoryModel} parent - Optional
	 * @param {Response} res -  envoie une réponse en json
	 * @return {void}
	**/
	async create(req: Request, res: Response){
		try{
			let {name} = req.body;
			if(!name){										// vérifie si property name existe
				logger.warn("wrong syntax");
				return res.status(401).send(res.__("wrong syntax"));
			}

			if(await Category.findOne({name: name})){		// vérifie son éxistence
				logger.warn("category already exists");
				return res.status(406).send(res.__("category already exist"));
			}

			let category = new Category({name: name});	// create new category

			// regarde si il n'y a pas de category parent
			let {parent} = req.body;
			if(parent){
				let catParent = await Category.findOne({_id: parent.id});
				if(!catParent){
					logger.warn("category parent not exists");
					return res.status(406).send(res.__("category parent not exists"));
				}
				
				category.parent = catParent;
				category.ancestors = catParent.ancestors;
				category.ancestors.push(catParent);
				catParent.childrens.push(category);

				await catParent.save();
			}


			let newCat = await category.save();
			return res.status(200).json(newCat);


/*			let myClass = this;
			category.save( (err, newCat) => {
				if(err){
					logger.error(err);
					res.status(500).send(err);
				}
				return res.status(200).json({category: myClass._reduceCategory(newCat)});
			});
*/			
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
			let category = await Category.findOne({_id: id});
			if(!category){
				logger.warn("Not find");
				return res.status(406).send(res.__("not find"));
			}
			return res.status(200).json({category:category});
		}catch (error) {
			logger.error(error);
	        return res.status(500).send(error);
	    }
	}







	/**
	 * @param {Request} req - reçoit tout les paramètres de la route
	 * @property {string} id
	 * @property {string} name
	 * @param {Response} res -  envoie une réponse en json
	 * @return {void}
	**/
	async update(req: Request, res: Response){
		try{
			let {id, name} = req.body;
			if(!id || !name){									// vérifie si paoperty id existe
				logger.warn("wrong syntax");
				return res.status(401).send(res.__("wrong syntax"));
			}

			let category = await Category.findOne({_id:id});
			if(!category){											// vérifie si category existe
				logger.warn("Category not exist");
				return res.status(404).send(res.__("category not exist"));
			}

			// modifie la catégorie
			let newCat = await Category.findOneAndUpdate({_id:id}, {name:name}, {returnOriginal: false})
			return res.status(200).json(newCat);

		}catch (error) {
			logger.error(error);
	        return res.status(500).send(error);
	    }
	}



	/**
	 * @param {Request} req - reçoit tout les paramètres de la route
	 * @property {string} _id
	 * @param {Response} res -  envoie une réponse en json
	 * @return {void}
	**/
	async delete(req: Request, res: Response){
		try{
			let {id} = req.body;
			if(!id){									// vérifie si paoperty id existe
				logger.warn("Wrong syntax");
				return res.status(401).send(res.__("wrong syntax"));
			}

			let category = Category.findOne({_id:id});
			if(!category){								// vérifie si category existe
				logger.warn("Category not exist");
				return res.status(404).send(res.__("category not exist"));
			}

			await Category.deleteOne({_id:id});		// supprime la category & ses enfants
			
			return res.status(200).send();
		}catch (error) {
			logger.error(error);
	        return res.status(500).send(error);
	    }
	}
}


export const CategoryController = new categoryController();
