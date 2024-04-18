"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const enchere_1 = require("../controllers/enchere");
const itemMiddleware_1 = require("../middleware/itemMiddleware");
const userMiddleware_1 = require("../middleware/userMiddleware");
router.post("/create", userMiddleware_1.UserMiddleware.connected, userMiddleware_1.UserMiddleware.isVerified, userMiddleware_1.UserMiddleware.isNotBanned, itemMiddleware_1.ItemMiddleware.get, enchere_1.EnchereController.create);
router.post("/update", userMiddleware_1.UserMiddleware.connected, userMiddleware_1.UserMiddleware.isVerified, userMiddleware_1.UserMiddleware.isNotBanned, itemMiddleware_1.ItemMiddleware.get, enchere_1.EnchereController.update);
router.post("/delete", userMiddleware_1.UserMiddleware.connected, userMiddleware_1.UserMiddleware.isVerified, userMiddleware_1.UserMiddleware.isNotBanned, itemMiddleware_1.ItemMiddleware.get, enchere_1.EnchereController.delete);
exports.default = router;
//# sourceMappingURL=enchere.js.map