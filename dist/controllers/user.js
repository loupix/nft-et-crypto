"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = exports.userController = void 0;
const password_hash_1 = __importDefault(require("password-hash"));
const environment_1 = __importDefault(require("../config/environment"));
const uuid_1 = require("uuid");
const user_1 = require("../schemas/user");
const bcrypt = __importStar(require("bcryptjs"));
const salt = bcrypt.genSaltSync(10);
const logger = require("../logger")(module);
/**
* Controller CRUD des utilisateurs
* Fonctions de Login, Admin, Banned
* Create ; Update ; Delete
* @author Loïc Daniel <loicdaniel.fr>
**/
class userController {
    /**
     * Constructeur
     * @param {none}
    **/
    constructor() {
        this.create = this.create.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
        this.login = this.login.bind(this);
        this.setAdmin = this.setAdmin.bind(this);
        this.setBanned = this.setBanned.bind(this);
    }
    /**
    * @param {Request} req - reçoit tout les paramètres de la route
    * @property {string} email
    * @property {string} password
    * @property {string} address - Donner par Web3Middleware
    * @param {Response} res -  envoie une réponse en json
    * @return {void}
    **/
    async create(req, res) {
        try {
            let { email, password, account } = req.body;
            if (!email || !account || !password) {
                logger.warn("Wrong syntax");
                return res.status(401).send(res.__("wrong syntax"));
            }
            let { visitor } = req.session;
            if (!visitor) {
                logger.warn("Not connected");
                return res.status(406).send(res.__("not connected"));
            }
            // On check en base si l'utilisateur existe déjà
            if (await user_1.User.findOne({ email: email })) {
                logger.warn("user already exists");
                return res.status(406).send(res.__("user already exist"));
            }
            let user = await new user_1.User({ email: email, password: password_hash_1.default.generate(password),
                account: account, visitor: visitor }).save(); // créer l'user et le sauvegarde
            // Send Email
            // Sauvegarde session
            req.session.user = user.toObject();
            req.session.save((err) => {
                if (err) {
                    logger.error(err);
                    return res.status(500).json(err);
                }
                return res.status(200).json(user);
            });
        }
        catch (error) {
            logger.error(error);
            return res.status(500).json(error);
        }
    }
    /**
    * @param {Request} req - reçoit tout les paramètres de la route
    * @param {Response} res -  envoie une réponse en json
    * @return {void}
    **/
    async delete(req, res) {
        try {
            let { user } = req.session;
            if (!user) {
                logger.warn("Not changed");
                return res.status(406).send(res.__("not changed"));
            }
            await user_1.User.deleteOne({ _id: user.id });
            req.session.destroy((err) => {
                if (err) {
                    logger.error(err);
                    res.status(500).json(err);
                }
                // send email 
                return res.status(200).send();
            });
        }
        catch (error) {
            logger.error(error);
            return res.status(500).json(error);
        }
    }
    /**
    * @param {Request} req - reçoit tout les paramètres de la route
    * @param {Response} res -  envoie une réponse en json
    * @return {void}
    **/
    async update(req, res) {
        try {
            let { user } = req.session;
        }
        catch (error) {
            logger.error(error);
            return res.status(500).json(error);
        }
    }
    /**
    * Vérifie si l'utilisateur est connecter
    * @param {Request} req - reçoit tout les paramètres de la route
    * @param {Response} res -  envoie une réponse en json
    * @return {void}
    **/
    async isLoggedIn(req, res) {
        try {
            let { user } = req.session;
            if (!user)
                return res.status(200).json(false);
            return res.status(200).json(user);
        }
        catch (error) {
            logger.error(error);
            return res.status(500).json(error);
        }
    }
    /**
    * Retourne les données utilisateur
    * @param {Request} req - reçoit tout les paramètres de la route
    * @param {Response} res -  envoie une réponse en json
    * @return {void}
    **/
    async getMe(req, res) {
        try {
            let { user } = req.session;
            return res.status(200).json(user);
        }
        catch (error) {
            logger.error(error);
            return res.status(500).json(error);
        }
    }
    /**
    * Se connect à l'utilisateur ou vas devoir crée un compte
    * @param {Request} req - reçoit tout les paramètres de la route
    * @property {string} password
    * @property {string} address - Donner par Web3Middleware
    * @param {Response} res -  envoie une réponse en json
    * @return {void}
    **/
    async login(req, res) {
        try {
            let { password, email, account } = req.body;
            let { visitor } = req.session;
            if (!visitor) {
                logger.warn("Not connected");
                return res.status(406).send(res.__("not connected"));
            }
            var user;
            if (!isNaN(email))
                user = await user_1.User.findOne({ email: email });
            else if (!isNaN(account))
                user = await user_1.User.findOne({ account: account });
            else {
                logger.warn("checkAccount - Wrong syntax");
                res.status(409).send(res.__("wrong syntax"));
            }
            if (!user && isNaN(account)) {
                // vérifie si il s'agie d'une reel address Web3
                const Web3 = require('web3');
                const wsAddress = "ws://" + environment_1.default.web3.ws.address + ":" + environment_1.default.web3.ws.port.toString();
                const httpAddress = "http://" + environment_1.default.web3.http.address + ":" + environment_1.default.web3.http.port.toString();
                const web3 = new Web3(wsAddress);
                if (!web3.utils.isAddress(account)) {
                    logger.warn("checkAccount - Wrong syntax");
                    res.status(409).send(res.__("wrong syntax"));
                }
                // créer un nouvelle user avec cette adress
                logger.info("Nouvelle user sans register");
                let newUser = await new user_1.User({ account: account, password: password_hash_1.default.generate(password),
                    email: account + "@blockchain.com", verified: true, visitor: visitor }).save();
                // Sauvegarde session
                req.session.user = newUser.toObject();
                req.session.save((err) => {
                    if (err) {
                        logger.error(err);
                        return res.status(500).json(err);
                    }
                    return res.status(200).json(user);
                });
            }
            else if (!password_hash_1.default.verify(password, user.password)) {
                logger.warn("Wrong password");
                return res.status(409).send(res.__("wrong password"));
            }
            else {
                if (!user) {
                    logger.warn("Not connected");
                    return res.status(406).send(res.__("not connected"));
                }
                let newUser = await user_1.User.findOneAndUpdate({ _id: user.id }, {}, { returnOriginal: false });
                if (!newUser) {
                    logger.warn("Not changed");
                    return res.status(406).send(res.__("not changed"));
                }
                // Sauvegarde session
                req.session.user = newUser;
                req.session.save((err) => {
                    if (err) {
                        logger.error(err);
                        return res.status(500).json(err);
                    }
                    return res.status(200).json(user);
                });
            }
        }
        catch (error) {
            logger.error(error);
            return res.status(500).json(error);
        }
    }
    /**
    * Change le niveau d'admin
    * @param {Request} req - reçoit tout les paramètres de la route
    * @property {UserSchema} user
    * @property {boolean} admin
    * @param {Response} res -  envoie une réponse en json
    * @return {void}
    **/
    async setAdmin(req, res) {
        try {
            let { user, admin } = req.body;
            if (isNaN(admin) || !user) {
                logger.warn("Wrong syntax");
                return res.status(401).send(res.__("wrong syntax"));
            }
            let newUser = await user_1.User.findOneAndUpdate({ _id: user === null || user === void 0 ? void 0 : user.id }, { "options.admin": admin }, { returnOriginal: false });
            if (!newUser) {
                logger.warn("Not changed");
                return res.status(406).send(res.__("not changed"));
            }
            return res.status(200).json(newUser);
        }
        catch (error) {
            logger.error(error);
            return res.status(500).json(error);
        }
    }
    /**
    * Change le niveau de banned
    * @param {Request} req - reçoit tout les paramètres de la route
    * @property {UserSchema} user
    * @property {boolean} banned
    * @param {Response} res -  envoie une réponse en json
    * @return {void}
    **/
    async setBanned(req, res) {
        try {
            let { user, banned } = req.body;
            if (isNaN(banned) || !user) {
                logger.warn("Wrong syntax");
                return res.status(401).send(res.__("wrong syntax"));
            }
            let newUser = await user_1.User.findOneAndUpdate({ _id: user.id }, { "options.banned": banned }, { returnOriginal: false });
            return res.status(200).json(newUser);
        }
        catch (error) {
            logger.error(error);
            return res.status(500).json(error);
        }
    }
    /**
    * Vérifie le token de l'email
    * @param {Request} req - reçoit tout les paramètres de la route
    * @property {string} token
    * @param {Response} res -  envoie une réponse en json
    * @return {void}
    **/
    async setMail(req, res) {
        try {
            let { token } = req.body;
            if (!token) {
                logger.warn("Wrong syntax");
                return res.status(401).send(res.__("wrong syntax"));
            }
            let user = await user_1.User.findOne({ "mail.token": token });
            if (!user) {
                logger.warn("setMail - User not exist");
                res.status(404).send(res.__("user not exist"));
            }
            let newUser = await user_1.User.findOneAndUpdate({ _id: user === null || user === void 0 ? void 0 : user.id }, { "options.verified": true, "mail.verified": true, "mail.token": (0, uuid_1.v4)().replace(/-/g, '') }, { returnOriginal: false });
            return res.status(200).json(newUser);
        }
        catch (error) {
            logger.error(error);
            return res.status(500).json(error);
        }
    }
}
exports.userController = userController;
exports.UserController = new userController();
//# sourceMappingURL=user.js.map