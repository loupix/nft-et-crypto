"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const multer_1 = __importDefault(require("multer"));
const upload = (0, multer_1.default)();
const item_1 = require("../controllers/item");
const userMiddleware_1 = require("../middleware/userMiddleware");
const contractMiddleware_1 = require("../middleware/contractMiddleware");
router.post("/create", userMiddleware_1.UserMiddleware.connected, upload.single("picture"), contractMiddleware_1.ContractMiddleware.create, item_1.ItemController.create);
router.post("/update", userMiddleware_1.UserMiddleware.connected, item_1.ItemController.update);
router.post("/delete", userMiddleware_1.UserMiddleware.connected, item_1.ItemController.delete);
exports.default = router;
//# sourceMappingURL=item.js.map