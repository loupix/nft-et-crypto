import {Request, Response} from 'express';
import passwordHash from "password-hash";

import config from '../config/environment';
import path from "path";
import fs from "fs";
import nodemailer from "nodemailer";
import {v4 as uuidv4} from 'uuid';


import {User, UserModel} from "../schemas/user";
import {Profile, ProfileModel} from "../schemas/profile";

import * as bcrypt from 'bcryptjs';
const salt = bcrypt.genSaltSync(10);

const logger = require("../logger")(module);




/**
* Controller CRUD des utilisateurs
* Fonctions de Login, Admin, Banned
* Create ; Update ; Delete
* @author Loïc Daniel <loicdaniel.fr>
**/

export class userController {

  /**
   * Constructeur
   * @param {none}
  **/
  constructor() { 
    this.create = this.create.bind(this)
    this.update = this.update.bind(this)
    this.delete = this.delete.bind(this)
    this.login = this.login.bind(this)
    this.setAdmin = this.setAdmin.bind(this)
    this.setBanned = this.setBanned.bind(this)
  }








  /**
  * @param {Request} req - reçoit tout les paramètres de la route
  * @property {string} email
  * @property {string} password
  * @property {string} address - Donner par Web3Middleware
  * @param {Response} res -  envoie une réponse en json
  * @return {void}
  **/

  async create(req: Request, res: Response){
    try{
      let {email, password, account} = req.body;
      if(!email || !account || !password){
        logger.warn("Wrong syntax");
        return res.status(401).send(res.__("wrong syntax"))
      }

      let {visitor} = req.session;
      if(!visitor){
        logger.warn("Not connected");
        return res.status(406).send(res.__("not connected"));
      }


      // On check en base si l'utilisateur existe déjà
      if(await User.findOne({email:email})){
        logger.warn("user already exists");
        return res.status(406).send(res.__("user already exist"));
       }
       
       let user = await new User({email: email, password: passwordHash.generate(password), 
        account: account, visitor: visitor}).save();  // créer l'user et le sauvegarde


       // Send Email



       // Sauvegarde session
       req.session.user = user.toObject();
       req.session.save((err) => {
         if(err){
           logger.error(err);
           return res.status(500).json(err);
         }
         return res.status(200).json(user);
      });

    }catch (error) {
      logger.error(error);
      return res.status(500).json(error);
    }
  }








  /**
  * @param {Request} req - reçoit tout les paramètres de la route
  * @param {Response} res -  envoie une réponse en json
  * @return {void}
  **/

  async delete(req: Request, res: Response){
    try{
      let {user} = req.session;
      if(!user){
        logger.warn("Not changed");
        return res.status(406).send(res.__("not changed"));
      }
      await User.deleteOne({_id:user.id});
      req.session.destroy((err) => {
        if(err){
          logger.error(err);
          res.status(500).json(err);
        }

        // send email 

        
        return res.status(200).send();
      });
    }catch (error) {
      logger.error(error);
          return res.status(500).json(error);
      }
  }


  /**
  * @param {Request} req - reçoit tout les paramètres de la route
  * @param {Response} res -  envoie une réponse en json
  * @return {void}
  **/

  async update(req: Request, res: Response){
    try{
      let {user} = req.session;

    }catch (error) {
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
  async isLoggedIn(req: Request, res: Response){
    try{
      let {user} = req.session;
      if(!user)
        return res.status(200).json(false);
      return res.status(200).json(user);
    }catch (error) {
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
  async getMe(req: Request, res: Response){
    try{
      let {user} = req.session;
      return res.status(200).json(user);
    }catch (error) {
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

  async login(req: Request, res: Response){
    try{
      let {password, email, account} = req.body;
      let {visitor} = req.session;
      if(!visitor){
        logger.warn("Not connected");
        return res.status(406).send(res.__("not connected"));
      }

      var user;
      if(!isNaN(email))
        user = await User.findOne({email: email}) as UserModel;
      else if(!isNaN(account))
        user = await User.findOne({account: account}) as UserModel;
      else{
        logger.warn("checkAccount - Wrong syntax");
        res.status(409).send(res.__("wrong syntax"));
      }

      if(!user && isNaN(account)){

        // vérifie si il s'agie d'une reel address Web3
        const Web3 = require('web3');
        const wsAddress = "ws://" + config.web3.ws.address + ":" + config.web3.ws.port.toString();
        const httpAddress = "http://" + config.web3.http.address + ":" + config.web3.http.port.toString();

        const web3 = new Web3(wsAddress);
        if(!web3.utils.isAddress(account)){
            logger.warn("checkAccount - Wrong syntax");
            res.status(409).send(res.__("wrong syntax"));
        }



        // créer un nouvelle user avec cette adress
        logger.info("Nouvelle user sans register");
        let newUser = await new User({account: account, password: passwordHash.generate(password), 
            email: account+"@blockchain.com", verified: true, visitor: visitor}).save();
        
          // Sauvegarde session
         req.session.user = newUser.toObject();
         req.session.save((err) => {
           if(err){
             logger.error(err);
             return res.status(500).json(err);
           }
           return res.status(200).json(user);
        });
      }else if(!passwordHash.verify(password, user.password)){
        logger.warn("Wrong password");
        return res.status(409).send(res.__("wrong password"));
      }else{

        if(!user){
          logger.warn("Not connected");
          return res.status(406).send(res.__("not connected"));
        }

        let newUser = await User.findOneAndUpdate({_id: user.id}, {}, {returnOriginal: false});
        if(!newUser){
          logger.warn("Not changed");
          return res.status(406).send(res.__("not changed"));
        }
        // Sauvegarde session
        req.session.user = newUser;
        req.session.save((err) => {
          if(err){
           logger.error(err);
           return res.status(500).json(err);
          }
          return res.status(200).json(user);
        });
      }


    }catch (error) {
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
  async setAdmin(req: Request, res: Response){
    try{
      let {user, admin} = req.body;
      if(isNaN(admin) || !user){
        logger.warn("Wrong syntax");
        return res.status(401).send(res.__("wrong syntax"))
      }
      let newUser = await User.findOneAndUpdate({_id: user?.id}, {"options.admin": admin}, {returnOriginal: false});
      if(!newUser){
        logger.warn("Not changed");
        return res.status(406).send(res.__("not changed"));
      }
      return res.status(200).json(newUser);

      
    }catch (error) {
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
  async setBanned(req: Request, res: Response){
    try{
      let {user, banned} = req.body;
      if(isNaN(banned) || !user){
        logger.warn("Wrong syntax");
        return res.status(401).send(res.__("wrong syntax"))
      }
      let newUser = await User.findOneAndUpdate({_id: user.id}, {"options.banned": banned}, {returnOriginal: false});
      return res.status(200).json(newUser);
    }catch (error) {
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
  async setMail(req: Request, res: Response){
    try{
      let {token} = req.body;
      if(!token){
        logger.warn("Wrong syntax");
        return res.status(401).send(res.__("wrong syntax"))
      }

      let user = await User.findOne({"mail.token": token});
      if(!user){
        logger.warn("setMail - User not exist");
        res.status(404).send(res.__("user not exist"));
      }

      let newUser = await User.findOneAndUpdate({_id: user?.id}, 
        {"options.verified": true, "mail.verified": true, "mail.token": uuidv4().replace(/-/g, '')}, 
        {returnOriginal: false}) as UserModel;
      return res.status(200).json(newUser);
    }catch (error) {
      logger.error(error);
      return res.status(500).json(error);
     }

  }



}


export const UserController = new userController();