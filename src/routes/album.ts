import express from 'express';
const router = express.Router();

import {AlbumController} from "../controllers/album";
import {UserMiddleware} from "../middleware/userMiddleware";
import {Web3Middleware} from "../middleware/web3Middleware";
import {AlbumMiddleware} from "../middleware/albumMiddleware";


router.post("/create", 
	UserMiddleware.connected,
	AlbumMiddleware.notExist,
	AlbumController.create);


router.post("/update", 
	UserMiddleware.connected,
	AlbumMiddleware.exist,
	AlbumMiddleware.isOwner,
	AlbumController.update);


router.post("/delete", 
	UserMiddleware.connected,
	AlbumMiddleware.exist,
	AlbumMiddleware.isOwner,
	AlbumController.delete);


export default router;
