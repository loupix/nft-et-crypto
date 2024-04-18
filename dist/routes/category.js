"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const category_1 = require("../controllers/category");
const userMiddleware_1 = require("../middleware/userMiddleware");
router.post("/create", userMiddleware_1.UserMiddleware.connected, userMiddleware_1.UserMiddleware.isAdmin, category_1.CategoryController.create);
router.post("/update", userMiddleware_1.UserMiddleware.connected, userMiddleware_1.UserMiddleware.isAdmin, category_1.CategoryController.update);
router.post("/delete", userMiddleware_1.UserMiddleware.connected, userMiddleware_1.UserMiddleware.isAdmin, category_1.CategoryController.delete);
exports.default = router;
//# sourceMappingURL=category.js.map