import express from 'express';
const router = express.Router();

import {UserController} from "../controllers/user";
import {UserMiddleware} from "../middleware/userMiddleware";
import {Web3Middleware} from "../middleware/web3Middleware";


router.post("/register", 
	UserMiddleware.createVisitor,
	UserMiddleware.notConnected, 
	UserMiddleware.notExist,
	UserMiddleware.checkEmail,
	UserMiddleware.createVisitor,
	Web3Middleware.createAccount,
	UserController.create);

router.get("/unregister",
	UserMiddleware.createVisitor,
	UserMiddleware.connected,
	UserMiddleware.exist,
	UserController.delete);

router.post("/login", 
	UserMiddleware.createVisitor,
	UserMiddleware.notConnected,
	UserMiddleware.exist, 
	UserMiddleware.checkEmail,
	Web3Middleware.checkAccount,
	UserController.login);

router.get("/isLoggedIn",
	UserController.isLoggedIn)

router.get("/getMe",
	UserMiddleware.connected,
	UserController.getMe)

router.get("/unlogin", 
	UserMiddleware.connected,
	UserMiddleware.disconnect,
	UserMiddleware.createVisitor, (rep, res) => {return res.status(200).send()});

router.post("/setAdmin",
	UserMiddleware.connected,
	UserMiddleware.isAdmin,
	UserController.setAdmin);

router.post("/setBanned",
	UserMiddleware.connected,
	UserMiddleware.isAdmin,
	UserController.setBanned);

export default router;