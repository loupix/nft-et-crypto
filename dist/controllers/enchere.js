"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnchereController = exports.enchereController = void 0;
const user_1 = require("../schemas/user");
const item_1 = require("../schemas/item");
const enchere_1 = require("../schemas/enchere");
const logger = require("../logger")(module);
/**
* Controller CRUD des encheres
* Create ; Update ; Delete
* @author Loïc Daniel <loicdaniel.fr>
**/
class enchereController {
    /**
     * Constructeur
     * @param {none}
     * @return {EnchereController}
    **/
    constructor() {
        this.create = this.create.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
    }
    /**
     * @param {Request} req - reçoit tout les paramètres de la route
     * @property {ItemModel} item
     * @property {Number} prix
     * @property {CategoryModel} category
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
            let { item, prix } = req.body;
            if (!item || !prix) {
                logger.warn("wrong syntax");
                return res.status(401).send(res.__("wrong syntax"));
            }
            item = await item_1.Item.findOne({ _id: item.id });
            if (!item) {
                logger.warn("Item non exist");
                return res.status(404).send(res.__("item not exist"));
            }
            else if (item.toObject().prix <= prix) {
                logger.warn("");
                return res.status(406).send(res.__(""));
            }
            let enchere = await new enchere_1.Enchere({ user: user, item: item, prix: prix }).save();
            item = await item_1.Item.findOneAndUpdate({ _id: item._id }, { $push: { "vente.encheres": enchere } }, { returnOriginal: false });
            // Sauvegarde session
            let newUser = await user_1.User.findOneAndUpdate({ _id: user.id }, { $push: { encheres: enchere } }, { returnOriginal: false });
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
                    enchere: enchere,
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
     * @property {string} id
     * @property {number} prix
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
            let { id, prix } = req.body;
            if (!id || !prix) {
                logger.warn("wrong syntax");
                return res.status(401).send(res.__("wrong syntax"));
            }
            let enchere = await enchere_1.Enchere.findOne({ _id: id });
            if (!enchere) {
                logger.warn("Enchere non exist");
                return res.status(404).send(res.__("enchere not exist"));
            }
            else if (enchere.user._id !== user._id) {
                logger.warn("User is not owner");
                return res.status(406).send(res.__("user is not owner"));
            }
            else if (enchere.prix < prix) {
                logger.warn("");
                return res.status(406).send(res.__(""));
            }
            let newEnchere = await enchere_1.Enchere.findOneAndUpdate({ _id: enchere._id }, { prix: prix }, { returnOriginal: false });
            if (!newEnchere) {
                logger.warn("Not changed");
                return res.status(406).send(res.__("not changed"));
            }
            return res.status(200).json({ enchere: enchere });
        }
        catch (error) {
            logger.error(error);
            return res.status(500).send(error);
        }
    }
    /**
     * @param {Request} req - reçoit tout les paramètres de la route
     * @property {string} id
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
            let enchere = await enchere_1.Enchere.findOne({ _id: id });
            if (!enchere) {
                logger.warn("Enchere non exist");
                return res.status(404).send(res.__("enchere not exist"));
            }
            else if (enchere.user.id !== user.id) {
                logger.warn("User is not owner");
                return res.status(406).send(res.__("user is not owner"));
            }
            await item_1.Item.deleteOne({ _id: id }); // supprime l'item
            // Sauvegarde session
            let newUser = await user_1.User.findOneAndUpdate({ _id: user._id }, { pull: { encheres: enchere } }, { returnOriginal: false });
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
                return res.status(200).send();
            });
        }
        catch (error) {
            logger.error(error);
            return res.status(500).send(error);
        }
    }
}
exports.enchereController = enchereController;
exports.EnchereController = new enchereController();
//# sourceMappingURL=enchere.js.map