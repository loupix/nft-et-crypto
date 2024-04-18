import express from 'express';
const router = express.Router();

import {EnchereController} from "../controllers/enchere";
import {ItemMiddleware} from "../middleware/itemMiddleware";
import {UserMiddleware} from "../middleware/userMiddleware";


router.post("/create", 
	UserMiddleware.connected,
	UserMiddleware.isVerified,
	UserMiddleware.isNotBanned,
	ItemMiddleware.get,
	EnchereController.create);


router.post("/update", 
	UserMiddleware.connected,
	UserMiddleware.isVerified,
	UserMiddleware.isNotBanned,
	ItemMiddleware.get,
	EnchereController.update);


router.post("/delete", 
	UserMiddleware.connected,
	UserMiddleware.isVerified,
	UserMiddleware.isNotBanned,
	ItemMiddleware.get,
	EnchereController.delete);


export default router;