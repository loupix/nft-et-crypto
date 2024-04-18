import express from 'express';
const router = express.Router();

import multer from 'multer';
const upload = multer();

import {ItemController} from "../controllers/item";
import {UserMiddleware} from "../middleware/userMiddleware";
import {Web3Middleware} from "../middleware/web3Middleware";
import {ContractMiddleware} from "../middleware/contractMiddleware";

router.post("/create", 
	UserMiddleware.connected,
	upload.single("picture"),
	ContractMiddleware.create,
	ItemController.create);


router.post("/update", 
	UserMiddleware.connected,
	ItemController.update);

router.post("/delete", 
	UserMiddleware.connected,
	ItemController.delete);

export default router;