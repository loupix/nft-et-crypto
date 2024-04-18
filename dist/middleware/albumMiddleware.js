"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlbumMiddleware = exports.albumMiddleware = void 0;
const album_1 = require("../schemas/album");
const logger = require("../logger")(module);
/**
* fonctions intermédiaire permetant d'ajouter
* des vues et des hovers sur un item à un visiteur et user
* @author Loïc Daniel <loicdaniel.fr>
**/
class albumMiddleware {
    /**
    * @param {Request} req - reçoit tout les paramètres de la route
    * @property {string} id - identifiant de l'album
    * @param {Response} res -  envoie une réponse en cas d'erreur
    * @param {NextFunction} next - fonctiion de callback
    * @return {void}
    * **/
    async exist(req, res, next) {
        try {
            let { id } = req.body;
            let album = await album_1.Album.findOne({ _id: id });
            if (!album) {
                logger.warn("Album not exist");
                return res.status(406).send(res.__("album not exist"));
            }
            req.body.album = album;
            next();
        }
        catch (error) {
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
    async notExist(req, res, next) {
        try {
            let { id } = req.body;
            let album = await album_1.Album.findOne({ _id: id });
            if (album) {
                logger.warn("Album already exist");
                return res.status(406).send(res.__("album already exist"));
            }
            req.body.album = album;
            next();
        }
        catch (error) {
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
    async isOwner(req, res, next) {
        try {
            let { id, album } = req.body;
            let { user } = req.session;
            if (!user) {
                logger.warn("Not connected");
                return res.status(406).send(res.__("not connected"));
            }
            if (!album)
                album = await album_1.Album.findOne({ _id: id });
            if (album.user != user.id) {
                logger.warn("User is not owner");
                return res.status(406).send(res.__("user is not owner"));
            }
            req.body.album = album;
            next();
        }
        catch (error) {
            logger.error(error);
            return res.status(500).send(error);
        }
    }
}
exports.albumMiddleware = albumMiddleware;
exports.AlbumMiddleware = new albumMiddleware();
//# sourceMappingURL=albumMiddleware.js.map