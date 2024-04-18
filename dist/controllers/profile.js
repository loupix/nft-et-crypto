"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileController = exports.profileController = void 0;
const logger = require("../logger")(module);
/**
* Controller CRUD des profile
* Create ; Update ; Delete
* @author Loïc Daniel <loicdaniel.fr>
**/
class profileController {
    /**
     * Constructeur
     * @param {none}
     * @return {ProfileController}
    **/
    constructor() { }
    /**
     * Créer un nouveau profile
     * @param {Request} req - reçoit tout les paramètres de la route
     * @property {String} firstname
     * @property {String} lastname
     * @property {String} photo
     * @property {String} gender
     * @param {Response} res -  envoie une réponse en json
     * @return {void}
    **/
    async create(req, res) {
        let { user } = req.session;
    }
    /**
     * modifie un profile
     * limité seulement à l'utilisateur
     * @param {Request} req - reçoit tout les paramètres de la route
     * @property {String} firstname
     * @property {String} lastname
     * @property {String} photo
     * @property {String} gender
     * @param {Response} res -  envoie une réponse en json
     * @return {void}
    **/
    async update(req, res) {
        let { user } = req.session;
    }
    /**
     * Supprime un profile
     * limité seulement à l'utilisat
     * @param {Request} req - reçoit tout les paramètres de la route
     * @property {integer} id - identifiant du profile
     * @param {Response} res -  envoie une réponse en json
     * @return {void}
    **/
    async delete(req, res) {
        let { user } = req.session;
    }
}
exports.profileController = profileController;
exports.ProfileController = new profileController();
//# sourceMappingURL=profile.js.map