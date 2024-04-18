"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const user_1 = require("../controllers/user");
const userMiddleware_1 = require("../middleware/userMiddleware");
const web3Middleware_1 = require("../middleware/web3Middleware");
router.post("/register", userMiddleware_1.UserMiddleware.createVisitor, userMiddleware_1.UserMiddleware.notConnected, userMiddleware_1.UserMiddleware.notExist, userMiddleware_1.UserMiddleware.checkEmail, userMiddleware_1.UserMiddleware.createVisitor, web3Middleware_1.Web3Middleware.createAccount, user_1.UserController.create);
router.get("/unregister", userMiddleware_1.UserMiddleware.createVisitor, userMiddleware_1.UserMiddleware.connected, userMiddleware_1.UserMiddleware.exist, user_1.UserController.delete);
router.post("/login", userMiddleware_1.UserMiddleware.createVisitor, userMiddleware_1.UserMiddleware.notConnected, userMiddleware_1.UserMiddleware.exist, userMiddleware_1.UserMiddleware.checkEmail, web3Middleware_1.Web3Middleware.checkAccount, user_1.UserController.login);
router.get("/isLoggedIn", user_1.UserController.isLoggedIn);
router.get("/getMe", userMiddleware_1.UserMiddleware.connected, user_1.UserController.getMe);
router.get("/unlogin", userMiddleware_1.UserMiddleware.connected, userMiddleware_1.UserMiddleware.disconnect, userMiddleware_1.UserMiddleware.createVisitor, (rep, res) => { return res.status(200).send(); });
router.post("/setAdmin", userMiddleware_1.UserMiddleware.connected, userMiddleware_1.UserMiddleware.isAdmin, user_1.UserController.setAdmin);
router.post("/setBanned", userMiddleware_1.UserMiddleware.connected, userMiddleware_1.UserMiddleware.isAdmin, user_1.UserController.setBanned);
exports.default = router;
//# sourceMappingURL=user.js.map