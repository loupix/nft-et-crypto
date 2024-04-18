"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemController = exports.itemController = void 0;
const album_1 = require("../schemas/album");
const user_1 = require("../schemas/user");
const category_1 = require("../schemas/category");
const item_1 = require("../schemas/item");
const logger = require("../logger")(module);
/**
* Controller CRUD des items
* Create ; Update ; Delete
* @author Loïc Daniel <loicdaniel.fr>
**/
class itemController {
    /**
     * Constructeur
     * @param {none}
     * @return {ItemController}
    **/
    constructor() {
        this.create = this.create.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
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
    async create(req, res) {
        try {
            let { user } = req.session;
            if (!user) {
                logger.warn("Not connected");
                return res.status(406).send(res.__("not connected"));
            }
            let { file } = req;
            let { title, category, album, contract } = req.body;
            if (!file || !title || !category || !contract || !album) {
                logger.warn("wrong syntax");
                return res.status(401).send(res.__("wrong syntax"));
            }
            if (await item_1.Item.findOne({ title: title })) {
                logger.warn("item already exists");
                return res.status(401).send(res.__("item already exists"));
            }
            let item = await new item_1.Item({ title: title, user: user,
                category: category, contract: contract }).save();
            // modif category
            await category_1.Category.findOneAndUpdate({ _id: category.id }, { $push: { items: item } });
            // modif album
            album = await album_1.Album.findOne({ _id: album.id });
            if (album && album.items.indexOf(item._id) == -1) {
                await album_1.Album.findOneAndUpdate({ _id: album.id }, { $push: { items: item } });
            }
            // Sauvegarde session
            let newUser = await user_1.User.findOneAndUpdate({ _id: user.id }, { $push: { items: item } }, { returnOriginal: false });
            if (!newUser) {
                logger.warn("Not changed");
                return res.status(406).send(res.__("not changed"));
            }
            req.session.user = newUser;
            req.session.save((err) => {
                if (err) {
                    logger.error(err);
                    return res.status(500).json(err);
                }
                return res.status(200).json({
                    item: item
                });
            });
        }
        catch (error) {
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
    async update(req, res) {
        try {
            let { user } = req.session;
            if (!user) {
                logger.warn("Not connected");
                return res.status(406).send(res.__("not connected"));
            }
            let { id, title } = req.body;
            if (!id || !title) {
                logger.warn("wrong syntax");
                return res.status(401).send(res.__("wrong syntax"));
            }
            let item = await item_1.Item.findOne({ _id: id });
            if (!item) {
                logger.warn("Album non exist");
                return res.status(404).send(res.__("album not exist"));
            }
            else if (item.user.id !== user.id) {
                logger.warn("User is not owner");
                return res.status(406).send(res.__("user is not owner"));
            }
            let newItem = await item_1.Item.findOneAndUpdate({ _id: id }, { title: title }, { returnOriginal: false });
            return res.status(200).json({
                item: newItem
            });
        }
        catch (error) {
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
    async delete(req, res) {
        try {
            let { user } = req.session;
            if (!user) {
                logger.warn("Not connected");
                return res.status(406).send(res.__("not connected"));
            }
            let { id } = req.body;
            if (!id) {
                logger.warn("wrong syntax");
                return res.status(401).send(res.__("wrong syntax"));
            }
            let item = await item_1.Item.findOne({ _id: id });
            if (!item) {
                logger.warn("Item non exist");
                return res.status(404).send(res.__("item not exist"));
            }
            else if (item.user.id !== user.id) {
                logger.warn("User is not owner");
                return res.status(406).send(res.__("user is not owner"));
            }
            // Supprime de la collection
            await album_1.Album.findOneAndUpdate({ _id: item.collection }, { $pull: { items: item } });
            // Supprime de la category
            await category_1.Category.findOneAndUpdate({ _id: item.category }, { $pull: { items: item } });
            await item_1.Item.deleteOne({ _id: id }); // supprime l'item
            // Sauvegarde session
            let newUser = await user_1.User.findOneAndUpdate({ _id: user.id }, { $pull: { items: item } }, { returnOriginal: false });
            if (!newUser) {
                logger.warn("Not changed");
                return res.status(406).send(res.__("not changed"));
            }
            req.session.user = newUser;
            req.session.save((err) => {
                if (err) {
                    logger.error(err);
                    return res.status(500).json(err);
                }
                return res.status(200).json({
                    item: item
                });
            });
            return res.status(200).send();
        }
        catch (error) {
            logger.error(error);
            return res.status(500).send(error);
        }
    }
}
exports.itemController = itemController;
exports.ItemController = new itemController();
//# sourceMappingURL=item.js.map