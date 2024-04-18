import express from 'express';
const router = express.Router();

import {CategoryController} from "../controllers/category";
import {UserMiddleware} from "../middleware/userMiddleware";
import {Web3Middleware} from "../middleware/web3Middleware";


router.post("/create", 
	UserMiddleware.connected,
	UserMiddleware.isAdmin,
	CategoryController.create)


router.post("/update", 
	UserMiddleware.connected,
	UserMiddleware.isAdmin,
	CategoryController.update)


router.post("/delete", 
	UserMiddleware.connected,
	UserMiddleware.isAdmin,
	CategoryController.delete)


export default router;