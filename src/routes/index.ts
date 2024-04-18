import express from 'express';
const router = express.Router();

import {UserMiddleware} from "../middleware/userMiddleware";

/* GET home page. */
router.get('/', 
	UserMiddleware.createVisitor,
	(req, res, next) => {
	  res.render('index', { title: 'Express' });
	});

export default router;
