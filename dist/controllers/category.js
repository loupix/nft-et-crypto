"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryController = exports.categoryController = void 0;
const category_1 = require("../schemas/category");
const logger = require("../logger")(module);
/**
* Controller CRUD des catégories
* Create ; Update ; Delete
* @author Loïc Daniel <loicdaniel.fr>
**/
class categoryController {
    /**
     * Constructeur
     * Seulement en admin
     * A utiliser avec UserMiddleware - isAdmin
     * @param {none}
     * @return {CategoryController}
    **/
    constructor() {
        this.create = this.create.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
    }
    /**
     * @param {Request} req - reçoit tout les paramètres de la route
     * @property {string} name
     * @property {CategoryModel} parent - Optional
     * @param {Response} res -  envoie une réponse en json
     * @return {void}
    **/
    async create(req, res) {
        try {
            let { name } = req.body;
            if (!name) { // vérifie si property name existe
                logger.warn("wrong syntax");
                return res.status(401).send(res.__("wrong syntax"));
            }
            if (await category_1.Category.findOne({ name: name })) { // vérifie son éxistence
                logger.warn("category already exists");
                return res.status(406).send(res.__("category already exist"));
            }
            let category = new category_1.Category({ name: name }); // create new category
            // regarde si il n'y a pas de category parent
            let { parent } = req.body;
            if (parent) {
                let catParent = await category_1.Category.findOne({ _id: parent.id });
                if (!catParent) {
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
        }
        catch (error) {
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
    async update(req, res) {
        try {
            let { id, name } = req.body;
            if (!id || !name) { // vérifie si paoperty id existe
                logger.warn("wrong syntax");
                return res.status(401).send(res.__("wrong syntax"));
            }
            let category = await category_1.Category.findOne({ _id: id });
            if (!category) { // vérifie si category existe
                logger.warn("Category not exist");
                return res.status(404).send(res.__("category not exist"));
            }
            // modifie la catégorie
            let newCat = await category_1.Category.findOneAndUpdate({ _id: id }, { name: name }, { returnOriginal: false });
            return res.status(200).json(newCat);
        }
        catch (error) {
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
    async delete(req, res) {
        try {
            let { id } = req.body;
            if (!id) { // vérifie si paoperty id existe
                logger.warn("Wrong syntax");
                return res.status(401).send(res.__("wrong syntax"));
            }
            let category = category_1.Category.findOne({ _id: id });
            if (!category) { // vérifie si category existe
                logger.warn("Category not exist");
                return res.status(404).send(res.__("category not exist"));
            }
            await category_1.Category.deleteOne({ _id: id }); // supprime la category & ses enfants
            return res.status(200).send();
        }
        catch (error) {
            logger.error(error);
            return res.status(500).send(error);
        }
    }
}
exports.categoryController = categoryController;
exports.CategoryController = new categoryController();
//# sourceMappingURL=category.js.map