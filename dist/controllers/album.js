"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlbumController = exports.albumController = void 0;
const user_1 = require("../schemas/user");
const album_1 = require("../schemas/album");
const category_1 = require("../schemas/category");
const item_1 = require("../schemas/item");
const logger = require("../logger")(module);
/**
* Controller CRUD des albums
* Create ; Update ; Delete
* @author Loïc Daniel <loicdaniel.fr>
**/
class albumController {
    /**
     * Constructeur
     * @param {none}
     * @return {AlbumController}
    **/
    constructor() { }
    /**
     * @param {Request} req - reçoit tout les paramètres de la route
     * @property {string} title
     * @property {CategoryModel} category
     * @property {array<ItemModel>} items - Renvoyer par un middleware
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
            let { title, category, items } = req.body;
            if (!title || !category || !items) { // vérifie si les property existe
                logger.warn("wrong syntax");
                return res.status(401).send(res.__("wrong syntax"));
            }
            category = await category_1.Category.findOne({ _id: category.id });
            if (await album_1.Album.findOne({ title: title, category: category })) { // vérifie si l'album existe
                logger.warn("album already exists");
                return res.status(406).send(res.__("album already exist"));
            }
            let album = await new album_1.Album({ title: title, category: category, items: items, user: user }).save();
            await category_1.Category.findOneAndUpdate({ _id: category._id }, { $push: { albums: album } });
            // Sauvegarde session
            let newUser = await user_1.User.findOneAndUpdate({ _id: user.id }, { $push: { albums: album } }, { returnOriginal: false });
            if (!newUser) {
                logger.warn("Not changed");
                return res.status(406).send(res.__("not changed"));
            }
            req.session.user = newUser.toObject();
            req.session.save((err) => {
                if (err) {
                    logger.error(err);
                    return res.status(500).json(err);
                }
                return res.status(200).json({
                    album: album,
                    user: newUser
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
     * @property {CategoryModel} category - si il veut changer de catégory
     * @property {array<ItemModel>} items - liste d'item de l'album ; par middleware ?
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
            let { album, title } = req.body;
            let { category, items } = req.body;
            // vérifie le changement de catégorie
            if (category) {
                category = await category_1.Category.findOne({ _id: category.id });
                if (album.category !== category.id)
                    await album_1.Album.findOneAndUpdate({ _id: album.id }, { category: category });
            }
            // vérifie si on ajoute des items
            if (items) {
                items = await item_1.Item.find({ id: { $in: items.map((item) => { return item.id; }) }
                });
                if (items.length != album.items.length)
                    await album_1.Album.findOneAndUpdate({ _id: album.id }, { items: items });
            }
            // modifie le nom de l'album
            let newAlbum = await album_1.Album.findOneAndUpdate({ _id: album.id }, { title: title }, { returnOriginal: false });
            if (!newAlbum) {
                logger.warn("Not changed");
                return res.status(406).send(res.__("not changed"));
            }
            return res.status(200).json({ album: newAlbum });
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
            let { album } = req.body;
            // supprime l'album & ses items
            await album_1.Album.deleteOne({ _id: album._id });
            // Sauvegarde session
            let newUser = await user_1.User.findOneAndUpdate({ _id: user.id }, { $pull: { albums: album._id } }, { returnOriginal: false });
            if (!newUser) {
                logger.warn("Not changed");
                return res.status(406).send(res.__("not changed"));
            }
            req.session.user = newUser.toObject();
            req.session.save((err) => {
                if (err) {
                    logger.error(err);
                    return res.status(500).json(err);
                }
                return res.status(200).json({
                    user: newUser
                });
            });
        }
        catch (error) {
            logger.error(error);
            return res.status(500).send(error);
        }
    }
}
exports.albumController = albumController;
exports.AlbumController = new albumController();
//# sourceMappingURL=album.js.map